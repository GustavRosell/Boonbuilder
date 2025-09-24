using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using BoonBuilder.Data;
using BoonBuilder.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp",
        policy => policy
            .WithOrigins(
                "http://localhost:3000",                    // Local development
                "https://*.railway.app",                    // Railway deployments
                Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:3000"  // Custom domain
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Add Entity Framework with SQLite (dev) or PostgreSQL (production)
builder.Services.AddDbContext<BoonBuilderContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

    if (!string.IsNullOrEmpty(databaseUrl))
    {
        // Railway PostgreSQL connection
        options.UseNpgsql(databaseUrl);
    }
    else if (!string.IsNullOrEmpty(connectionString))
    {
        // Local SQLite connection
        options.UseSqlite(connectionString);
    }
    else
    {
        // Fallback to default SQLite
        options.UseSqlite("Data Source=boonbuilder.db");
    }
});

// Register services
builder.Services.AddScoped<BoonBuilder.Services.IBoonService, BoonBuilder.Services.BoonService>();
builder.Services.AddScoped<BoonBuilder.Services.IBuildService, BoonBuilder.Services.BuildService>();

// Add Identity for authentication (simplified for now)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Simplified password requirements for development
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
})
    .AddEntityFrameworkStores<BoonBuilderContext>()
    .AddDefaultTokenProviders();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("ReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Initialize database and seed data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BoonBuilderContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    // Run migrations to create/update database
    await context.Database.MigrateAsync();

    // Seed data
    await BoonSeeder.SeedAsync(context, userManager);
}

app.Run();
