// Program.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using BoonBuilder.Data;
using BoonBuilder.Models;
using BoonBuilder.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp",
        builder => builder
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Add Entity Framework with SQLite
builder.Services.AddDbContext<BoonBuilderContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=boonbuilder.db"));

// Add Identity for authentication (simplified for now)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<BoonBuilderContext>()
    .AddDefaultTokenProviders();

// Add custom services
builder.Services.AddScoped<IBoonService, BoonService>();
builder.Services.AddScoped<IBuildService, BuildService>();

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

// Seed database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BoonBuilderContext>();
    context.Database.Migrate();
    await BoonSeeder.SeedAsync(context);
}

app.Run();

// ===== MODELS =====

// Models/Enums.cs
namespace BoonBuilder.Models
{
    public enum BoonType
    {
        Core = 1,
        Duo = 2,
        Legendary = 3,
        Chaos = 4,
        Infusion = 5,
        Hex = 6,
        Godsent = 7
    }

    public enum BoonSlot
    {
        Attack = 1,
        Special = 2,
        Cast = 3,
        Sprint = 4,
        Dash = 5,
        Magick = 6
    }

    public enum ElementType
    {
        Air = 1,
        Water = 2,
        Earth = 3,
        Fire = 4,
        Aether = 5
    }

    public enum BoonRarity
    {
        Common = 1,
        Rare = 2,
        Epic = 3,
        Heroic = 4,
        Legendary = 5
    }

    public enum WeaponType
    {
        WitchStaff = 1,
        SisterBlades = 2,
        UmbralFlames = 3,
        MoonstoneAxe = 4,
        ArgentSkull = 5,
        BlackCoat = 6
    }

    public enum BuildDifficulty
    {
        Easy = 1,
        Medium = 2,
        Hard = 3,
        Expert = 4,
        Master = 5
    }

    public enum BuildTier
    {
        S = 1,
        A = 2,
        B = 3,
        C = 4,
        D = 5
    }
}

// Models/God.cs
namespace BoonBuilder.Models
{
    public class God
    {
        public int GodId { get; set; }
        public string Name { get; set; }
        public string IconUrl { get; set; }
        public ElementType? PrimaryElement { get; set; }
        public ElementType? SecondaryElement { get; set; }
        public string StatusEffect { get; set; }
        public string Description { get; set; }

        // Navigation properties
        public ICollection<Boon> Boons { get; set; }
        public ICollection<DuoBoon> PrimaryDuoBoons { get; set; }
        public ICollection<DuoBoon> SecondaryDuoBoons { get; set; }
    }
}

// Models/Weapon.cs
namespace BoonBuilder.Models
{
    public class Weapon
    {
        public int WeaponId { get; set; }
        public WeaponType Type { get; set; }
        public string Name { get; set; }
        public string IconUrl { get; set; }
        public string Description { get; set; }

        // Navigation properties
        public ICollection<WeaponAspect> Aspects { get; set; }
    }

    public class WeaponAspect
    {
        public int AspectId { get; set; }
        public int WeaponId { get; set; }
        public string Name { get; set; }
        public string IconUrl { get; set; }
        public string Description { get; set; }
        public bool IsHidden { get; set; }

        // Navigation properties
        public Weapon Weapon { get; set; }
        public ICollection<Build> Builds { get; set; }
    }
}

// Models/Boon.cs
namespace BoonBuilder.Models
{
    public class Boon
    {
        public int BoonId { get; set; }
        public string Name { get; set; }
        public BoonType Type { get; set; }
        public int? GodId { get; set; }
        public BoonSlot? Slot { get; set; }
        public string Description { get; set; }
        public string Effect { get; set; }
        public string IconUrl { get; set; }
        public ElementType? Element { get; set; }
        public string StatusEffect { get; set; }
        public bool IsPassive { get; set; }

        // Navigation properties
        public God God { get; set; }
        public ICollection<BoonPrerequisite> Prerequisites { get; set; }
        public ICollection<BoonPrerequisite> RequiredFor { get; set; }
        public ICollection<BoonRarityValue> RarityValues { get; set; }
        public ICollection<BuildBoon> BuildBoons { get; set; }
    }

    public class DuoBoon : Boon
    {
        public int FirstGodId { get; set; }
        public int SecondGodId { get; set; }
        
        // Navigation properties
        public God FirstGod { get; set; }
        public God SecondGod { get; set; }
    }

    public class BoonRarityValue
    {
        public int RarityValueId { get; set; }
        public int BoonId { get; set; }
        public BoonRarity Rarity { get; set; }
        public string Value { get; set; } // Can be damage, percentage, duration, etc.
        public string Description { get; set; }

        // Navigation properties
        public Boon Boon { get; set; }
    }

    public class BoonPrerequisite
    {
        public int PrerequisiteId { get; set; }
        public int BoonId { get; set; }
        public int RequiredBoonId { get; set; }
        public bool IsAlternative { get; set; } // For OR relationships
        public int AlternativeGroupId { get; set; } // Groups alternatives together

        // Navigation properties
        public Boon Boon { get; set; }
        public Boon RequiredBoon { get; set; }
    }
}

// Models/Build.cs
namespace BoonBuilder.Models
{
    public class Build
    {
        public int BuildId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string AuthorId { get; set; }
        public int WeaponAspectId { get; set; }
        public BuildDifficulty Difficulty { get; set; }
        public BuildTier Tier { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsPublic { get; set; }
        public int LikeCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string PlaystyleTags { get; set; } // JSON array of tags

        // Navigation properties
        public ApplicationUser Author { get; set; }
        public WeaponAspect WeaponAspect { get; set; }
        public ICollection<BuildBoon> BuildBoons { get; set; }
        public ICollection<UserFavorite> Favorites { get; set; }
    }

    public class BuildBoon
    {
        public int BuildBoonId { get; set; }
        public int BuildId { get; set; }
        public int BoonId { get; set; }
        public BoonSlot? Slot { get; set; }
        public int Order { get; set; } // For display order

        // Navigation properties
        public Build Build { get; set; }
        public Boon Boon { get; set; }
    }

    public class UserFavorite
    {
        public int FavoriteId { get; set; }
        public string UserId { get; set; }
        public int BuildId { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public ApplicationUser User { get; set; }
        public Build Build { get; set; }
    }
}

// Models/ApplicationUser.cs
using Microsoft.AspNetCore.Identity;

namespace BoonBuilder.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Navigation properties
        public ICollection<Build> Builds { get; set; }
        public ICollection<UserFavorite> Favorites { get; set; }
    }
}

// Data/BoonBuilderContext.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace BoonBuilder.Data
{
    public class BoonBuilderContext : IdentityDbContext<ApplicationUser>
    {
        public BoonBuilderContext(DbContextOptions<BoonBuilderContext> options)
            : base(options) { }

        public DbSet<God> Gods { get; set; }
        public DbSet<Weapon> Weapons { get; set; }
        public DbSet<WeaponAspect> WeaponAspects { get; set; }
        public DbSet<Boon> Boons { get; set; }
        public DbSet<DuoBoon> DuoBoons { get; set; }
        public DbSet<BoonRarityValue> BoonRarityValues { get; set; }
        public DbSet<BoonPrerequisite> BoonPrerequisites { get; set; }
        public DbSet<Build> Builds { get; set; }
        public DbSet<BuildBoon> BuildBoons { get; set; }
        public DbSet<UserFavorite> UserFavorites { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure DuoBoon inheritance
            modelBuilder.Entity<DuoBoon>()
                .HasBaseType<Boon>();

            // Configure DuoBoon relationships
            modelBuilder.Entity<DuoBoon>()
                .HasOne(d => d.FirstGod)
                .WithMany(g => g.PrimaryDuoBoons)
                .HasForeignKey(d => d.FirstGodId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DuoBoon>()
                .HasOne(d => d.SecondGod)
                .WithMany(g => g.SecondaryDuoBoons)
                .HasForeignKey(d => d.SecondGodId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure BoonPrerequisite relationships
            modelBuilder.Entity<BoonPrerequisite>()
                .HasOne(bp => bp.Boon)
                .WithMany(b => b.Prerequisites)
                .HasForeignKey(bp => bp.BoonId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BoonPrerequisite>()
                .HasOne(bp => bp.RequiredBoon)
                .WithMany(b => b.RequiredFor)
                .HasForeignKey(bp => bp.RequiredBoonId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes for performance
            modelBuilder.Entity<Boon>()
                .HasIndex(b => new { b.Type, b.GodId, b.Slot });

            modelBuilder.Entity<Build>()
                .HasIndex(b => new { b.IsPublic, b.Tier, b.CreatedAt });

            modelBuilder.Entity<BoonPrerequisite>()
                .HasIndex(bp => bp.RequiredBoonId);
        }
    }
}