# PowerShell script to generate PostgreSQL-specific migration
# This demonstrates the approach - in production, you would set PG_MIGRATION_DATABASE_URL to your actual PostgreSQL instance

# Set environment variable for PostgreSQL migration generation
# This is a sample connection string format - replace with your actual PostgreSQL URL
$env:PG_MIGRATION_DATABASE_URL = "postgresql://postgres:password@localhost:5432/boonbuilder"

Write-Host "Generating PostgreSQL-specific migration..."
Write-Host "Environment variable set: PG_MIGRATION_DATABASE_URL=$env:PG_MIGRATION_DATABASE_URL"

# Change to API directory and generate migration
Set-Location "BoonBuilder.API"

try {
    # This would generate the PostgreSQL-specific migration
    # dotnet ef migrations add PostgreSQLSpecificMigration

    Write-Host "Migration generation command: dotnet ef migrations add PostgreSQLSpecificMigration"
    Write-Host "Note: This requires an actual PostgreSQL instance to be running"
    Write-Host "For Railway deployment, use your actual Railway DATABASE_URL value"
} finally {
    # Clean up environment variable
    Remove-Item env:PG_MIGRATION_DATABASE_URL -ErrorAction SilentlyContinue
    Set-Location ".."
}

Write-Host "Script completed. The DesignTimeDbContextFactory will now use PostgreSQL when PG_MIGRATION_DATABASE_URL is set."