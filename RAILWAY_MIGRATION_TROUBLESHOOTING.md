# Railway EF Core Migration Troubleshooting Guide

This guide helps diagnose and resolve EF Core "PendingModelChanges" warnings on Railway PostgreSQL deployments.

## Quick Diagnosis Commands

### 1. Check Migration Status
```powershell
# Run comprehensive diagnostics
.\railway-migration-diagnostics.ps1 -DatabaseUrl "postgresql://user:pass@host:port/db"

# Apply missing migration directly
.\apply-railway-migration.ps1 -DatabaseUrl "postgresql://user:pass@host:port/db"
```

### 2. Manual Migration Check
```powershell
# Check what migrations are missing
$env:PGPASSWORD = "your-db-password"
psql -h host -p port -U user -d dbname -c "SELECT \"MigrationId\" FROM \"__EFMigrationsHistory\" ORDER BY \"MigrationId\";"
```

### 3. Apply Specific Migration
```powershell
cd BoonBuilder.API
dotnet ef database update 20250926000329_PgProviderSync --connection "Host=host;Port=port;Database=db;Username=user;Password=pass;"
```

## Root Causes & Solutions

### 1. PgProviderSync Migration Not Applied ❌
**Symptoms**:
- Railway logs show `PgProviderSync status: Applied=False, Pending=True`
- EF Core warns about pending model changes

**Solution**:
```powershell
# Apply the missing migration
.\apply-railway-migration.ps1 -DatabaseUrl $env:DATABASE_URL
```

### 2. DATABASE_URL Environment Variable Missing ❌
**Symptoms**:
- Railway logs show `DATABASE_URL: NULL`
- App falls back to SQLite: `Using fallback SQLite`

**Solution**:
1. Go to Railway dashboard → Your service → Variables
2. Add `DATABASE_URL` with value from PostgreSQL service
3. Redeploy the application

### 3. Model Drift (Schema Differences) ❌
**Symptoms**:
- Migration shows as applied but EF still detects drift
- Runtime model doesn't match database schema

**Diagnosis**:
```powershell
# Generate temp migration to see what changed
$env:PG_MIGRATION_DATABASE_URL = "postgresql://user:pass@host:port/db"
cd BoonBuilder.API
dotnet ef migrations add TEMP_CHECK

# Inspect the generated migration file
# If empty = no drift, if has changes = drift exists

# Clean up
dotnet ef migrations remove
Remove-Item env:PG_MIGRATION_DATABASE_URL
```

### 4. Connection String Parse Error ❌
**Symptoms**:
- `Error parsing DATABASE_URL` in logs
- Connection failures despite correct URL

**Solution**:
Check DATABASE_URL format:
- ✅ Correct: `postgresql://user:pass@host:5432/dbname`
- ❌ Wrong: `postgres://user:pass@host:5432/dbname`

### 5. Railway Database Startup Race Condition ❌
**Symptoms**:
- Intermittent connection failures
- "connection refused" errors

**Already Handled**: Program.cs includes retry logic with exponential backoff

### 6. SKIP_MIGRATIONS Flag Set ⚠️
**Symptoms**:
- `SKIP_MIGRATIONS=true; skipping automatic migrations at startup`
- Migrations don't run despite being pending

**Solution**:
1. Remove `SKIP_MIGRATIONS` environment variable from Railway
2. OR apply migrations manually if intentionally skipping

## Expected Railway Logs After Fix

### Successful Database Connection
```
=== DATABASE CONNECTION DEBUG ===
DefaultConnection: NULL
DATABASE_URL: postgresql://user:****@host:5432/db
Using PostgreSQL with DATABASE_URL
Converted connection string: Host=host;Port=5432;Database=db;Username=user;Password=****;
```

### Successful Migration Diagnostics
```
=== MIGRATION DIAGNOSTICS ===
Database provider: Npgsql.EntityFrameworkCore.PostgreSQL
Migrations in assembly: 20250914183918_InitialCreate,20250915160309_AddPetSystem,20250915225247_RenamePetToFamiliar,20250926000329_PgProviderSync
Applied on DB: 20250914183918_InitialCreate,20250915160309_AddPetSystem,20250915225247_RenamePetToFamiliar,20250926000329_PgProviderSync
Pending on DB:
PgProviderSync status: Applied=True, Pending=False
Database connectivity test: SUCCESS
PostgreSQL version: PostgreSQL 13.7 on x86_64-pc-linux-gnu, compiled...
==============================
```

### Successful Migration Execution
```
Attempting database migration (attempt 1/5)
Database migration completed successfully
```

## Verification Checklist

After applying fixes, verify these items:

- [ ] Railway environment has `DATABASE_URL` set correctly
- [ ] Railway logs show PostgreSQL connection (not SQLite fallback)
- [ ] `PgProviderSync status: Applied=True, Pending=False`
- [ ] `Database connectivity test: SUCCESS`
- [ ] No "PendingModelChanges" warnings in startup logs
- [ ] Application starts without migration-related errors
- [ ] API endpoints respond correctly

## Emergency Bypass

If you need to temporarily bypass the issue:

```powershell
# Set in Railway environment variables
SKIP_MIGRATIONS=true
```

**⚠️ RISKS**:
- Schema drift remains unresolved
- Potential runtime errors with model/database mismatches
- Should only be used for temporary unblocking

## Manual Database Verification

Connect directly to Railway PostgreSQL:

```sql
-- Check migration history
SELECT "MigrationId", "ProductVersion"
FROM "__EFMigrationsHistory"
ORDER BY "MigrationId";

-- Should include: 20250926000329_PgProviderSync

-- Check table schema (example)
\d "Boons"  -- Should show PostgreSQL types (integer, boolean, character varying)

-- Test connectivity
SELECT version();
```

## Files Modified by This Fix

- `Program.cs`: Enhanced migration diagnostics
- `railway-migration-diagnostics.ps1`: Comprehensive diagnostic script
- `apply-railway-migration.ps1`: Direct migration application
- `RAILWAY_MIGRATION_TROUBLESHOOTING.md`: This troubleshooting guide

## Common PowerShell Commands

```powershell
# Check local git status
git status --porcelain
git log --oneline -5

# Test local build
cd BoonBuilder.API
dotnet build
dotnet ef migrations list

# Generate PostgreSQL migration locally (requires PG connection)
$env:PG_MIGRATION_DATABASE_URL = "postgresql://user:pass@localhost:5432/testdb"
dotnet ef migrations add TestMigration
```

## Railway Dashboard Checks

1. **Environment Variables**:
   - `DATABASE_URL` should be set to PostgreSQL service URL
   - `SKIP_MIGRATIONS` should NOT be set (unless intentional)

2. **PostgreSQL Service**:
   - Should be running and healthy
   - Connection details match DATABASE_URL

3. **Deployment Logs**:
   - Look for the diagnostic blocks from Program.cs
   - Check for successful migration completion
   - Monitor for any connection errors

## Contact & Support

If this guide doesn't resolve your issue, check:
1. Railway documentation for PostgreSQL setup
2. EF Core migration documentation
3. This project's commit history for similar issues

The enhanced diagnostics in Program.cs should provide specific error messages to help pinpoint the exact issue.