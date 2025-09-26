# Quick Migration Application Script for Railway
# This script applies the PgProviderSync migration directly to Railway database

param(
    [Parameter(Mandatory=$true)]
    [string]$DatabaseUrl,

    [string]$TargetMigration = "20250926000329_PgProviderSync",

    [switch]$DryRun = $false
)

Write-Host "=== Railway Migration Application Script ===" -ForegroundColor Green
Write-Host "Target Migration: $TargetMigration" -ForegroundColor Yellow

try {
    # Parse DATABASE_URL to get connection components
    $uri = [System.Uri]$DatabaseUrl
    $userInfo = $uri.UserInfo.Split(':')
    $npgsqlConnectionString = "Host=$($uri.Host);Port=$($uri.Port);Database=$($uri.LocalPath.TrimStart('/'));Username=$($userInfo[0]);Password=$($userInfo[1]);"

    Write-Host "Parsed connection string: $($npgsqlConnectionString.Substring(0, 50))..." -ForegroundColor Cyan

    # Change to API directory
    Set-Location "BoonBuilder.API"

    if ($DryRun) {
        Write-Host "`n[DRY RUN MODE] Would execute:" -ForegroundColor Yellow
        Write-Host "dotnet ef database update $TargetMigration --connection `"$npgsqlConnectionString`""
        Write-Host "`nTo apply for real, run without -DryRun flag" -ForegroundColor Yellow
    } else {
        Write-Host "`nApplying migration to Railway database..." -ForegroundColor Yellow

        # Apply the specific migration
        $output = & dotnet ef database update $TargetMigration --connection $npgsqlConnectionString 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Migration applied successfully!" -ForegroundColor Green
            Write-Host "Output: $output"

            Write-Host "`nVerifying migration was applied..."
            # Check if migration is now in the database
            $uri = [System.Uri]$DatabaseUrl
            $userInfo = $uri.UserInfo.Split(':')
            $env:PGPASSWORD = $userInfo[1]

            $checkQuery = "SELECT COUNT(*) FROM `"__EFMigrationsHistory`" WHERE `"MigrationId`" = '$TargetMigration';"
            $result = & psql -h $uri.Host -p $uri.Port -U $userInfo[0] -d $uri.LocalPath.TrimStart('/') -t -c $checkQuery 2>$null

            if ($result -and $result.Trim() -eq "1") {
                Write-Host "✅ Migration $TargetMigration confirmed in database!" -ForegroundColor Green
            } else {
                Write-Host "⚠️  Could not verify migration in database. Check manually." -ForegroundColor Yellow
            }

            Remove-Item env:PGPASSWORD -ErrorAction SilentlyContinue
        } else {
            Write-Host "❌ Migration failed!" -ForegroundColor Red
            Write-Host "Error output: $output"
            Write-Host "`nTroubleshooting tips:" -ForegroundColor Yellow
            Write-Host "1. Verify DATABASE_URL is correct and accessible"
            Write-Host "2. Check if the target migration exists locally"
            Write-Host "3. Ensure Railway database is running and accepting connections"
            Write-Host "4. Consider running with verbose logging: dotnet ef database update --verbose"
        }
    }

} catch {
    Write-Host "❌ Script failed: $_" -ForegroundColor Red
} finally {
    Set-Location ".."
}

Write-Host "`n=== POST-MIGRATION STEPS ===" -ForegroundColor Green
Write-Host "1. Redeploy your Railway application to pick up the fixed schema"
Write-Host "2. Monitor Railway logs for:"
Write-Host "   - 'PgProviderSync status: Applied=True, Pending=False'"
Write-Host "   - 'Database connectivity test: SUCCESS'"
Write-Host "   - No more 'PendingModelChanges' warnings"
Write-Host "3. Test your application endpoints to ensure everything works"

Write-Host "`nExample Railway logs to look for:" -ForegroundColor Cyan
Write-Host "=== DATABASE CONNECTION DEBUG ==="
Write-Host "DATABASE_URL: postgresql://user:****@host:5432/db"
Write-Host "Using PostgreSQL with DATABASE_URL"
Write-Host ""
Write-Host "=== MIGRATION DIAGNOSTICS ==="
Write-Host "Database provider: Npgsql.EntityFrameworkCore.PostgreSQL"
Write-Host "PgProviderSync status: Applied=True, Pending=False"
Write-Host "Database connectivity test: SUCCESS"