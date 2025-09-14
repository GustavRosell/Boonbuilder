using BoonBuilder.Models;

namespace BoonBuilder.Services
{
    public interface IBuildService
    {
        Task<IEnumerable<Build>> GetPublicBuildsAsync(BuildTier? tier = null, int? weaponId = null, bool featured = false);
        Task<IEnumerable<Build>> GetUserBuildsAsync(string userId);
        Task<IEnumerable<Build>> GetFavoriteBuildsAsync(string userId);
        Task<Build?> GetBuildByIdAsync(int buildId);
        Task<Build> CreateBuildAsync(Build build, IList<BuildBoon> buildBoons);
        Task<Build?> UpdateBuildAsync(int buildId, Build build, IList<BuildBoon> buildBoons);
        Task<bool> DeleteBuildAsync(int buildId);
        Task<bool> AddToFavoritesAsync(string userId, int buildId);
        Task<bool> RemoveFromFavoritesAsync(string userId, int buildId);
        Task<bool> ValidateBuildAsync(Build build, IList<BuildBoon> buildBoons);
        Task<BuildTier> CalculateBuildTierAsync(Build build, IList<BuildBoon> buildBoons);
    }
}