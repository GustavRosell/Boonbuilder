using BoonBuilder.Models;

namespace BoonBuilder.Services
{
    public interface IBoonService
    {
        Task<IEnumerable<Boon>> GetAllBoonsAsync();
        Task<IEnumerable<Boon>> GetCoreBoonsByGodAsync(int godId);
        Task<IEnumerable<DuoBoon>> GetAvailableDuoBoonsAsync(IList<int> selectedBoonIds);
        Task<Boon?> GetBoonByIdAsync(int boonId);
        Task<IEnumerable<Boon>> GetBoonsByTypeAsync(BoonType type);
        Task<bool> ValidateBoonPrerequisitesAsync(int boonId, IList<int> selectedBoonIds);
        Task<IEnumerable<Boon>> GetCompatibleBoonsAsync(IList<int> selectedBoonIds);
    }
}