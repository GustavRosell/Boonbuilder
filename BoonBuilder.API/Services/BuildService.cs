using Microsoft.EntityFrameworkCore;
using BoonBuilder.Data;
using BoonBuilder.Models;

namespace BoonBuilder.Services
{
    public class BuildService : IBuildService
    {
        private readonly BoonBuilderContext _context;
        private readonly IBoonService _boonService;

        public BuildService(BoonBuilderContext context, IBoonService boonService)
        {
            _context = context;
            _boonService = boonService;
        }

        public async Task<IEnumerable<Build>> GetPublicBuildsAsync(BuildTier? tier = null, int? weaponId = null, bool featured = false)
        {
            var query = _context.Builds
                .Where(b => b.IsPublic)
                .Include(b => b.Author)
                .Include(b => b.WeaponAspect)
                    .ThenInclude(wa => wa.Weapon)
                .Include(b => b.BuildBoons)
                    .ThenInclude(bb => bb.Boon)
                        .ThenInclude(b => b.God)
                .AsQueryable();

            if (tier.HasValue)
                query = query.Where(b => b.Tier == tier.Value);

            if (weaponId.HasValue)
                query = query.Where(b => b.WeaponAspect.WeaponId == weaponId.Value);

            if (featured)
                query = query.Where(b => b.IsFeatured);

            return await query
                .OrderByDescending(b => b.LikeCount)
                .ThenByDescending(b => b.UpdatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Build>> GetUserBuildsAsync(string userId)
        {
            return await _context.Builds
                .Where(b => b.AuthorId == userId)
                .Include(b => b.WeaponAspect)
                    .ThenInclude(wa => wa.Weapon)
                .Include(b => b.BuildBoons)
                    .ThenInclude(bb => bb.Boon)
                        .ThenInclude(b => b.God)
                .OrderByDescending(b => b.UpdatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Build>> GetFavoriteBuildsAsync(string userId)
        {
            return await _context.UserFavorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Build)
                    .ThenInclude(b => b.Author)
                .Include(f => f.Build)
                    .ThenInclude(b => b.WeaponAspect)
                        .ThenInclude(wa => wa.Weapon)
                .Include(f => f.Build)
                    .ThenInclude(b => b.BuildBoons)
                        .ThenInclude(bb => bb.Boon)
                            .ThenInclude(b => b.God)
                .Select(f => f.Build)
                .OrderByDescending(b => b.UpdatedAt)
                .ToListAsync();
        }

        public async Task<Build?> GetBuildByIdAsync(int buildId)
        {
            return await _context.Builds
                .Include(b => b.Author)
                .Include(b => b.WeaponAspect)
                    .ThenInclude(wa => wa.Weapon)
                .Include(b => b.BuildBoons)
                    .ThenInclude(bb => bb.Boon)
                        .ThenInclude(b => b.God)
                .FirstOrDefaultAsync(b => b.BuildId == buildId);
        }

        public async Task<Build> CreateBuildAsync(Build build, IList<BuildBoon> buildBoons)
        {
            // Validate the build first
            if (!await ValidateBuildAsync(build, buildBoons))
            {
                throw new InvalidOperationException("Build validation failed");
            }

            // Calculate the tier automatically
            build.Tier = await CalculateBuildTierAsync(build, buildBoons);
            build.CreatedAt = DateTime.UtcNow;
            build.UpdatedAt = DateTime.UtcNow;

            // Add the build
            await _context.Builds.AddAsync(build);
            await _context.SaveChangesAsync();

            // Add the build boons with correct BuildId
            foreach (var buildBoon in buildBoons)
            {
                buildBoon.BuildId = build.BuildId;
            }

            await _context.BuildBoons.AddRangeAsync(buildBoons);
            await _context.SaveChangesAsync();

            return build;
        }

        public async Task<Build?> UpdateBuildAsync(int buildId, Build updatedBuild, IList<BuildBoon> buildBoons)
        {
            var existingBuild = await _context.Builds.FindAsync(buildId);
            if (existingBuild == null)
                return null;

            // Validate the updated build
            if (!await ValidateBuildAsync(updatedBuild, buildBoons))
            {
                throw new InvalidOperationException("Build validation failed");
            }

            // Update build properties
            existingBuild.Name = updatedBuild.Name;
            existingBuild.Description = updatedBuild.Description;
            existingBuild.WeaponAspectId = updatedBuild.WeaponAspectId;
            existingBuild.Difficulty = updatedBuild.Difficulty;
            existingBuild.Tier = await CalculateBuildTierAsync(updatedBuild, buildBoons);
            existingBuild.IsPublic = updatedBuild.IsPublic;
            existingBuild.PlaystyleTags = updatedBuild.PlaystyleTags;
            existingBuild.UpdatedAt = DateTime.UtcNow;

            // Remove existing build boons
            var existingBuildBoons = await _context.BuildBoons
                .Where(bb => bb.BuildId == buildId)
                .ToListAsync();
            _context.BuildBoons.RemoveRange(existingBuildBoons);

            // Add new build boons
            foreach (var buildBoon in buildBoons)
            {
                buildBoon.BuildId = buildId;
            }
            await _context.BuildBoons.AddRangeAsync(buildBoons);

            await _context.SaveChangesAsync();
            return existingBuild;
        }

        public async Task<bool> DeleteBuildAsync(int buildId)
        {
            var build = await _context.Builds.FindAsync(buildId);
            if (build == null)
                return false;

            _context.Builds.Remove(build);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddToFavoritesAsync(string userId, int buildId)
        {
            var existingFavorite = await _context.UserFavorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.BuildId == buildId);

            if (existingFavorite != null)
                return false; // Already favorited

            var favorite = new UserFavorite
            {
                UserId = userId,
                BuildId = buildId,
                CreatedAt = DateTime.UtcNow
            };

            await _context.UserFavorites.AddAsync(favorite);

            // Increment like count on the build
            var build = await _context.Builds.FindAsync(buildId);
            if (build != null)
            {
                build.LikeCount++;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveFromFavoritesAsync(string userId, int buildId)
        {
            var favorite = await _context.UserFavorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.BuildId == buildId);

            if (favorite == null)
                return false; // Not favorited

            _context.UserFavorites.Remove(favorite);

            // Decrement like count on the build
            var build = await _context.Builds.FindAsync(buildId);
            if (build != null && build.LikeCount > 0)
            {
                build.LikeCount--;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ValidateBuildAsync(Build build, IList<BuildBoon> buildBoons)
        {
            // Basic validation
            if (string.IsNullOrEmpty(build.Name))
                return false;

            if (build.WeaponAspectId <= 0)
                return false;

            // Check if weapon aspect exists
            var weaponAspect = await _context.WeaponAspects.FindAsync(build.WeaponAspectId);
            if (weaponAspect == null)
                return false;

            // Validate boon slots (no duplicates)
            var slotCounts = buildBoons
                .Where(bb => bb.Slot.HasValue)
                .GroupBy(bb => bb.Slot.Value)
                .Where(g => g.Count() > 1);

            if (slotCounts.Any())
                return false; // Duplicate slots found

            // Validate boon prerequisites
            var selectedBoonIds = buildBoons.Select(bb => bb.BoonId).ToList();

            foreach (var buildBoon in buildBoons)
            {
                if (!await _boonService.ValidateBoonPrerequisitesAsync(buildBoon.BoonId, selectedBoonIds))
                {
                    return false; // Prerequisites not met
                }
            }

            return true;
        }

        public async Task<BuildTier> CalculateBuildTierAsync(Build build, IList<BuildBoon> buildBoons)
        {
            // Simple tier calculation algorithm
            int score = 0;

            // Base score for having all 5 core slots filled
            var coreSlots = buildBoons.Where(bb => bb.Slot.HasValue).Count();
            score += coreSlots * 10; // 10 points per slot (max 50)

            // Bonus for Duo Boons
            var duoBoonsCount = 0;
            foreach (var buildBoon in buildBoons)
            {
                var boon = await _context.Boons.FindAsync(buildBoon.BoonId);
                if (boon?.Type == BoonType.Duo)
                    duoBoonsCount++;
            }
            score += duoBoonsCount * 25; // 25 points per duo boon

            // Bonus for Legendary Boons
            var legendaryBoonsCount = 0;
            foreach (var buildBoon in buildBoons)
            {
                var boon = await _context.Boons.FindAsync(buildBoon.BoonId);
                if (boon?.Type == BoonType.Legendary)
                    legendaryBoonsCount++;
            }
            score += legendaryBoonsCount * 40; // 40 points per legendary boon

            // Determine tier based on score
            return score switch
            {
                >= 150 => BuildTier.S,
                >= 120 => BuildTier.A,
                >= 80 => BuildTier.B,
                >= 50 => BuildTier.C,
                _ => BuildTier.D
            };
        }
    }
}