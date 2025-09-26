# Railway EF Core Migration Diagnostics & Remediation Script
# This script provides step-by-step commands to diagnose and fix EF Core migration issues on Railway

param(
    [string]$DatabaseUrl = $null,
    [switch]$ApplyMigration = $false,
    [switch]$CheckOnly = $true
)

Write-Host "=== Railway EF Core Migration Diagnostics ===" -ForegroundColor Green

# Step 1: Verify local migration state
Write-Host "`n1. VERIFYING LOCAL MIGRATION STATE" -ForegroundColor Yellow
Write-Host "Checking git status for uncommitted changes..."
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Uncommitted changes detected:" -ForegroundColor Red
    Write-Host $gitStatus
    Write-Host "Consider committing migration files before proceeding." -ForegroundColor Yellow
} else {
    Write-Host "✅ All migration files are committed" -ForegroundColor Green
}

Write-Host "`nChecking recent commits for PgProviderSync migration..."
$recentCommits = git log --oneline -10 --grep="PgProviderSync" 2>$null
if ($recentCommits) {
    Write-Host "✅ Found PgProviderSync migration in recent commits:" -ForegroundColor Green
    Write-Host $recentCommits
} else {
    Write-Host "⚠️  PgProviderSync migration not found in recent commit history" -ForegroundColor Yellow
}

# Step 2: List available migrations
Write-Host "`n2. LISTING LOCAL MIGRATIONS" -ForegroundColor Yellow
$migrationFiles = Get-ChildItem -Path "BoonBuilder.API\Migrations\*.cs" -Name | Where-Object { $_ -like "*Migration*.cs" -and $_ -notlike "*Designer.cs" -and $_ -notlike "*Snapshot.cs" }
if ($migrationFiles) {
    Write-Host "Local migration files found:" -ForegroundColor Green
    foreach ($file in $migrationFiles) {
        $migrationId = $file -replace '\.cs$', ''
        if ($file -like "*PgProviderSync*") {
            Write-Host "  ✅ $migrationId (TARGET MIGRATION)" -ForegroundColor Green
        } else {
            Write-Host "  📄 $migrationId" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "❌ No migration files found!" -ForegroundColor Red
}

# Step 3: Generate diagnostic commands
Write-Host "`n3. RAILWAY DATABASE DIAGNOSTICS" -ForegroundColor Yellow

if ([string]::IsNullOrEmpty($DatabaseUrl)) {
    Write-Host "⚠️  DATABASE_URL not provided. Get it from Railway dashboard." -ForegroundColor Yellow
    Write-Host "Usage: .\railway-migration-diagnostics.ps1 -DatabaseUrl 'postgresql://user:pass@host:port/db'"
    Write-Host ""
} else {
    Write-Host "Using DATABASE_URL: $($DatabaseUrl.Substring(0, 30))..." -ForegroundColor Green

    # Parse DATABASE_URL
    try {
        $uri = [System.Uri]$DatabaseUrl
        $userInfo = $uri.UserInfo.Split(':')
        $host = $uri.Host
        $port = $uri.Port
        $database = $uri.LocalPath.TrimStart('/')
        $username = $userInfo[0]
        $password = $userInfo[1]

        Write-Host "Parsed connection details:" -ForegroundColor Cyan
        Write-Host "  Host: $host"
        Write-Host "  Port: $port"
        Write-Host "  Database: $database"
        Write-Host "  Username: $username"
        Write-Host "  Password: [HIDDEN]"

        # Generate Npgsql connection string
        $npgsqlConnectionString = "Host=$host;Port=$port;Database=$database;Username=$username;Password=$password;"

        Write-Host "`n4. VERIFYING APPLIED MIGRATIONS ON RAILWAY DB" -ForegroundColor Yellow

        # Test database connection using psql if available
        $env:PGPASSWORD = $password
        Write-Host "Testing database connectivity..."

        $testConnection = & psql -h $host -p $port -U $username -d $database -c "SELECT 1;" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database connection successful" -ForegroundColor Green

            Write-Host "`nQuerying migration history..."
            $migrationQuery = "SELECT `"MigrationId`" FROM `"__EFMigrationsHistory`" ORDER BY `"MigrationId`";"
            $appliedMigrations = & psql -h $host -p $port -U $username -d $database -t -c $migrationQuery 2>$null

            if ($appliedMigrations) {
                Write-Host "Applied migrations on Railway DB:" -ForegroundColor Green
                $appliedMigrations | ForEach-Object {
                    $migration = $_.Trim()
                    if ($migration -like "*PgProviderSync*") {
                        Write-Host "  ✅ $migration (TARGET MIGRATION APPLIED)" -ForegroundColor Green
                    } elseif (-not [string]::IsNullOrEmpty($migration)) {
                        Write-Host "  📄 $migration" -ForegroundColor Cyan
                    }
                }

                # Check if PgProviderSync is applied
                $pgSyncApplied = $appliedMigrations -like "*PgProviderSync*"
                if (-not $pgSyncApplied) {
                    Write-Host "`n❌ PgProviderSync migration NOT APPLIED to Railway DB!" -ForegroundColor Red
                    Write-Host "This is likely the root cause of the pending model changes warning."

                    if ($ApplyMigration) {
                        Write-Host "`n5. APPLYING MISSING MIGRATION" -ForegroundColor Yellow
                        Write-Host "Attempting to apply PgProviderSync migration..."

                        Set-Location "BoonBuilder.API"
                        try {
                            & dotnet ef database update --connection $npgsqlConnectionString
                            Write-Host "✅ Migration applied successfully!" -ForegroundColor Green
                        } catch {
                            Write-Host "❌ Migration failed: $_" -ForegroundColor Red
                        } finally {
                            Set-Location ".."
                        }
                    } else {
                        Write-Host "`nTo apply the missing migration, run:" -ForegroundColor Yellow
                        Write-Host "  cd BoonBuilder.API"
                        Write-Host "  dotnet ef database update --connection `"$npgsqlConnectionString`""
                        Write-Host "OR run this script with -ApplyMigration flag"
                    }
                } else {
                    Write-Host "`n✅ PgProviderSync migration is already applied!" -ForegroundColor Green
                    Write-Host "The issue may be a model drift problem. Consider generating a temp migration to identify differences."
                }
            } else {
                Write-Host "❌ Could not retrieve migration history or no migrations found" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Could not connect to Railway database. Check DATABASE_URL and network connectivity." -ForegroundColor Red
        }

        # Clean up password environment variable
        Remove-Item env:PGPASSWORD -ErrorAction SilentlyContinue

    } catch {
        Write-Host "❌ Failed to parse DATABASE_URL: $_" -ForegroundColor Red
    }
}

# Step 6: Model drift detection
Write-Host "`n6. MODEL DRIFT DETECTION" -ForegroundColor Yellow
Write-Host "To check for model drift, run this command with your Railway DATABASE_URL:"
Write-Host ""
Write-Host "`$env:PG_MIGRATION_DATABASE_URL = `"$DatabaseUrl`""
Write-Host "cd .\BoonBuilder.API"
Write-Host "dotnet ef migrations add TEMP_CHECK"
Write-Host "# Inspect the generated migration - if it's empty, no drift exists"
Write-Host "dotnet ef migrations remove"
Write-Host "Remove-Item env:PG_MIGRATION_DATABASE_URL"
Write-Host ""

# Step 7: Railway deployment commands
Write-Host "`n7. RAILWAY DEPLOYMENT VERIFICATION" -ForegroundColor Yellow
Write-Host "After fixing the migration issue:"
Write-Host "1. Commit any changes: git add -A && git commit -m `"fix: Apply PgProviderSync migration to Railway DB`""
Write-Host "2. Push to trigger Railway deployment: git push"
Write-Host "3. Monitor Railway logs for the diagnostic output:"
Write-Host "   - Look for 'DATABASE CONNECTION DEBUG' block"
Write-Host "   - Look for 'MIGRATION DIAGNOSTICS' block"
Write-Host "   - Verify 'PgProviderSync status: Applied=True, Pending=False'"
Write-Host "   - Check for successful 'Database migration completed successfully' message"

Write-Host "`n=== VERIFICATION CHECKLIST ===" -ForegroundColor Green
Write-Host "✅ Migration files committed and pushed"
Write-Host "⬜ DATABASE_URL environment variable set in Railway"
Write-Host "⬜ PgProviderSync migration applied to Railway DB"
Write-Host "⬜ Railway logs show PostgreSQL connection (not SQLite fallback)"
Write-Host "⬜ No 'PendingModelChanges' warnings in Railway startup logs"
Write-Host "⬜ Application starts successfully without migration errors"

Write-Host "`nFor Railway environment variables, check:"
Write-Host "- DATABASE_URL is set correctly"
Write-Host "- SKIP_MIGRATIONS is NOT set to 'true' (unless intentional)"

Write-Host "`n=== END DIAGNOSTICS ===" -ForegroundColor Green