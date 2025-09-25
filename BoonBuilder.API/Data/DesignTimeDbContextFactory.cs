using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BoonBuilder.Data
{
    /// <summary>
    /// Design-time factory for creating BoonBuilderContext instances during migrations.
    /// This enables PostgreSQL-specific migration generation when PG_MIGRATION_DATABASE_URL is set.
    /// </summary>
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<BoonBuilderContext>
    {
        public BoonBuilderContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<BoonBuilderContext>();

            // Check for PostgreSQL migration environment variable
            var pgMigrationUrl = Environment.GetEnvironmentVariable("PG_MIGRATION_DATABASE_URL");

            if (!string.IsNullOrEmpty(pgMigrationUrl))
            {
                Console.WriteLine("Using PostgreSQL for migration generation");

                // Convert PostgreSQL URL to Npgsql connection string format
                var npgsqlConnectionString = ConvertPostgresUrlToConnectionString(pgMigrationUrl);
                optionsBuilder.UseNpgsql(npgsqlConnectionString);
            }
            else
            {
                Console.WriteLine("Using SQLite for migration generation (fallback)");
                optionsBuilder.UseSqlite("Data Source=boonbuilder.db");
            }

            return new BoonBuilderContext(optionsBuilder.Options);
        }

        /// <summary>
        /// Converts PostgreSQL URL format to Npgsql connection string format.
        /// </summary>
        private static string ConvertPostgresUrlToConnectionString(string databaseUrl)
        {
            try
            {
                var uri = new Uri(databaseUrl);
                var userInfo = uri.UserInfo.Split(':');

                return $"Host={uri.Host};Port={uri.Port};Database={uri.LocalPath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing PG_MIGRATION_DATABASE_URL: {ex.Message}");
                throw;
            }
        }
    }
}