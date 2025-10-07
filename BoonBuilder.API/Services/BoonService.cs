using Microsoft.EntityFrameworkCore;
using BoonBuilder.Data;
using BoonBuilder.Models;

namespace BoonBuilder.Services
{
    public class BoonService : IBoonService
    {
        private readonly BoonBuilderContext _context;

        public BoonService(BoonBuilderContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Boon>> GetAllBoonsAsync()
        {
            return await _context.Boons
                .Include(b => b.God)
                .OrderBy(b => b.GodId)
                .ThenBy(b => b.Slot)
                .ToListAsync();
        }

        public async Task<IEnumerable<Boon>> GetCoreBoonsByGodAsync(int godId)
        {
            return await _context.Boons
                .Where(b => b.Type == BoonType.Core && b.GodId == godId)
                .Include(b => b.God)
                .OrderBy(b => b.Slot)
                .ToListAsync();
        }

        public async Task<IEnumerable<DuoBoon>> GetAvailableDuoBoonsAsync(IList<int> selectedBoonIds)
        {
            var duoBoons = await _context.DuoBoons
                .Include(d => d.FirstGod)
                .Include(d => d.SecondGod)
                .Include(d => d.Prerequisites)
                .ToListAsync();

            var availableDuoBoons = new List<DuoBoon>();

            foreach (var duoBoon in duoBoons)
            {
                if (await ValidateBoonPrerequisitesAsync(duoBoon.BoonId, selectedBoonIds))
                {
                    availableDuoBoons.Add(duoBoon);
                }
            }

            return availableDuoBoons;
        }

        public async Task<Boon?> GetBoonByIdAsync(int boonId)
        {
            return await _context.Boons
                .Include(b => b.God)
                .Include(b => b.Prerequisites)
                    .ThenInclude(p => p.RequiredBoon)
                .FirstOrDefaultAsync(b => b.BoonId == boonId);
        }

        public async Task<IEnumerable<Boon>> GetBoonsByTypeAsync(BoonType type)
        {
            return await _context.Boons
                .Where(b => b.Type == type)
                .Include(b => b.God)
                .ToListAsync();
        }

        public async Task<bool> ValidateBoonPrerequisitesAsync(int boonId, IList<int> selectedBoonIds)
        {
            var prerequisites = await _context.BoonPrerequisites
                .Where(p => p.BoonId == boonId)
                .ToListAsync();

            if (!prerequisites.Any())
                return true; // No prerequisites means it's always available

            // Group prerequisites by AlternativeGroupId
            var prerequisiteGroups = prerequisites
                .GroupBy(p => p.AlternativeGroupId)
                .ToList();

            // Check if all groups are satisfied
            foreach (var group in prerequisiteGroups)
            {
                // For each group, at least one alternative must be satisfied
                bool groupSatisfied = group.Any(p => selectedBoonIds.Contains(p.RequiredBoonId));

                if (!groupSatisfied)
                {
                    return false; // If any group is not satisfied, the boon is not available
                }
            }

            return true; // All groups are satisfied
        }

        public async Task<IEnumerable<Boon>> GetCompatibleBoonsAsync(IList<int> selectedBoonIds)
        {
            // Get all boons that don't conflict with selected ones
            var allBoons = await GetAllBoonsAsync();
            var compatibleBoons = new List<Boon>();

            foreach (var boon in allBoons)
            {
                // Skip if already selected
                if (selectedBoonIds.Contains(boon.BoonId))
                    continue;

                // Check if this boon's prerequisites are met
                if (await ValidateBoonPrerequisitesAsync(boon.BoonId, selectedBoonIds))
                {
                    compatibleBoons.Add(boon);
                }
            }

            return compatibleBoons;
        }
    }
}