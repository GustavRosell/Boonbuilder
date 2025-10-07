# Railway Deployment Guide for BoonBuilder

## Summary

Railway's `railway.toml` file uses paths that are absolute from the repository root. The Service Root setting in the Railway UI affects build working directory for UI-defined builds but does NOT change `railway.toml` path resolution.

In our monorepo `boonbuilder-frontend` lives in `boonbuilder-frontend/`. Set `dockerfilePath = "boonbuilder-frontend/Dockerfile"` in the repo `railway.toml`.

## Common Failure Modes

### 1. "Dockerfile does not exist"
- **Cause**: `railway.toml` references `Dockerfile` (repo root) while the file is in `boonbuilder-frontend/`
- **Fix**: Use `dockerfilePath = "boonbuilder-frontend/Dockerfile"` (repo-absolute path)

### 2. File exists locally but isn't committed or is an OneDrive placeholder
- **Cause**: OneDrive cloud-only files or Git tracking issues
- **Fix**: Ensure files are fully local and committed to Git

### 3. npm build fails with missing devDependencies
- **Cause**: Dockerfile runs `npm ci --only=production` before `npm run build`
- **Fix**: Use `npm ci` (not `--only=production`) in build stage for React builds

## Checklist to Fix and Verify

1. **Ensure `boonbuilder-frontend/Dockerfile` is committed and correctly cased**
   ```bash
   git ls-files --stage boonbuilder-frontend/Dockerfile
   git check-ignore -v boonbuilder-frontend/Dockerfile || echo "Not ignored"
   ```

2. **Update `boonbuilder-frontend/railway.toml` with repo-absolute `dockerfilePath`**
   ```toml
   [build]
   builder = "DOCKERFILE"
   dockerfilePath = "boonbuilder-frontend/Dockerfile"
   ```

3. **Use `npm ci` (not `npm ci --only=production`) in build stage of Dockerfile**
   ```dockerfile
   # Install all dependencies (including devDependencies needed for build)
   RUN npm ci
   ```

4. **Test locally (if Docker available)**
   ```bash
   docker build -t boonfrontend:local -f boonbuilder-frontend/Dockerfile boonbuilder-frontend
   docker run --rm -p 8080:80 boonfrontend:local
   # Check http://localhost:8080/
   ```

5. **Push changes and verify Railway deployment**
   - Check Railway build logs for commit SHA and Dockerfile detection
   - Verify `npm run build` succeeds in build stage
   - Confirm service returns HTTP 200 on health endpoint

## OneDrive Note

If this repo is in OneDrive, confirm files are available locally (not "online-only") before committing. OneDrive placeholders can be pushed as empty files and cause CI to fail.

**Check file status in Windows:**
- Files with cloud icon are not fully local
- Open files in editor to force download before committing

## Railway Configuration

### Frontend Service Settings
- **Service Root**: `boonbuilder-frontend/`
- **Dockerfile Path**: `boonbuilder-frontend/Dockerfile` (in railway.toml)
- **Port**: 80 (nginx default)
- **Health Check**: `/health` endpoint

### Environment Variables
- `REACT_APP_API_URL`: Set to your Railway API service URL
  - Example: `https://your-api-service.railway.app/api`

## Troubleshooting

### Build Logs Show Wrong Dockerfile Path
```
✅ Good: "Using Dockerfile at boonbuilder-frontend/Dockerfile"
❌ Bad:  "Dockerfile `Dockerfile` does not exist"
```

### npm run build Fails
```
✅ Good: "RUN npm ci" (includes devDependencies)
❌ Bad:  "RUN npm ci --only=production" (missing build tools)
```

### Service Sleeps/Restarts
- Check `railway.toml` has `sleepApplication = false`
- Verify health check endpoint is working
- Monitor Railway service logs for errors

## Alternative: Railway Buildpacks

Instead of Docker, you can use Railway's automatic Node.js detection:

1. **Remove** `railway.toml` and `Dockerfile`
2. **Set Service Root** to `boonbuilder-frontend` in Railway UI
3. **Configure build command**: `npm run build`
4. **Configure start command**: `npm start` or use a static server

This approach is simpler but less customizable than Docker.

## Testing Recipe

From repo root:
```bash
# Verify Git tracking
git status --porcelain
git ls-files boonbuilder-frontend/Dockerfile

# Build and test locally (if Docker available)
docker build -f boonbuilder-frontend/Dockerfile -t boonfrontend:local boonbuilder-frontend
docker run --rm -p 8080:80 boonfrontend:local

# Test frontend serving
curl -sSf http://localhost:8080/ | grep -q "<!doctype html>" && echo "Frontend OK" || echo "Frontend failed"
```

## What to Report for Issues

When reporting Railway deployment issues, include:

1. **Railway build logs** (first 50 lines and final status)
2. **Service Root setting** from Railway UI
3. **Exact commit SHA** Railway built from
4. **Contents of `railway.toml`** and `Dockerfile`
5. **Git file status**: `git ls-files boonbuilder-frontend/Dockerfile`

## Success Criteria

- ✅ Railway build logs show correct Dockerfile path
- ✅ `npm run build` completes successfully in build stage
- ✅ Frontend service returns HTTP 200 on `/` and `/health`
- ✅ Service stays active (no sleeping/restart loops)
- ✅ Frontend can connect to API service via `REACT_APP_API_URL`