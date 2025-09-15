using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BoonBuilder.Data;
using BoonBuilder.Models;

namespace BoonBuilder.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BoonsController : ControllerBase
    {
        private readonly BoonBuilderContext _context;

        public BoonsController(BoonBuilderContext context)
        {
            _context = context;
        }

        // GET: api/boons
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetBoons()
        {
            var boons = await _context.Boons
                .Include(b => b.God)
                .Select(b => new
                {
                    b.BoonId,
                    b.Name,
                    b.Type,
                    b.Slot,
                    b.Description,
                    b.Effect,
                    b.IconUrl,
                    b.Element,
                    b.StatusEffect,
                    b.IsPassive,
                    God = b.God != null ? new
                    {
                        b.God.GodId,
                        b.God.Name,
                        b.God.IconUrl
                    } : null
                })
                .ToListAsync();

            return Ok(boons);
        }

        // GET: api/boons/core
        [HttpGet("core")]
        public async Task<ActionResult<IEnumerable<object>>> GetCoreBoons()
        {
            var boons = await _context.Boons
                .Where(b => b.Type == BoonType.Core)
                .Include(b => b.God)
                .GroupBy(b => b.GodId)
                .Select(g => new
                {
                    GodId = g.Key,
                    GodName = g.First().God!.Name,
                    GodIcon = g.First().God!.IconUrl,
                    Boons = g.Select(b => new
                    {
                        b.BoonId,
                        b.Name,
                        b.Slot,
                        b.Description,
                        b.Effect,
                        b.IconUrl,
                        b.Element,
                        b.StatusEffect
                    })
                })
                .ToListAsync();

            return Ok(boons);
        }

        // GET: api/boons/duo
        [HttpGet("duo")]
        public async Task<ActionResult<IEnumerable<object>>> GetDuoBoons()
        {
            var duoBoons = await _context.DuoBoons
                .Include(d => d.FirstGod)
                .Include(d => d.SecondGod)
                .Include(d => d.Prerequisites)
                    .ThenInclude(p => p.RequiredBoon)
                .Select(d => new
                {
                    d.BoonId,
                    d.Name,
                    d.Description,
                    d.Effect,
                    d.IconUrl,
                    FirstGod = new
                    {
                        d.FirstGod.GodId,
                        d.FirstGod.Name,
                        d.FirstGod.IconUrl
                    },
                    SecondGod = new
                    {
                        d.SecondGod.GodId,
                        d.SecondGod.Name,
                        d.SecondGod.IconUrl
                    },
                    Prerequisites = d.Prerequisites.Select(p => new
                    {
                        p.RequiredBoonId,
                        RequiredBoonName = p.RequiredBoon.Name,
                        p.IsAlternative,
                        p.AlternativeGroupId
                    })
                })
                .ToListAsync();

            return Ok(duoBoons);
        }

        // GET: api/boons/legendary
        [HttpGet("legendary")]
        public async Task<ActionResult<IEnumerable<object>>> GetLegendaryBoons()
        {
            var legendaryBoons = await _context.Boons
                .Where(b => b.Type == BoonType.Legendary)
                .Include(b => b.God)
                .Include(b => b.Prerequisites)
                    .ThenInclude(p => p.RequiredBoon)
                .Select(b => new
                {
                    b.BoonId,
                    b.Name,
                    b.Description,
                    b.Effect,
                    b.IconUrl,
                    b.Element,
                    God = b.God != null ? new
                    {
                        b.God.GodId,
                        b.God.Name,
                        b.God.IconUrl
                    } : null,
                    Prerequisites = b.Prerequisites.Select(p => new
                    {
                        p.RequiredBoonId,
                        RequiredBoonName = p.RequiredBoon.Name,
                        p.IsAlternative,
                        p.AlternativeGroupId
                    })
                })
                .ToListAsync();

            return Ok(legendaryBoons);
        }

        // GET: api/boons/available
        [HttpPost("available")]
        public async Task<ActionResult<object>> GetAvailableBoons([FromBody] List<int> selectedBoonIds)
        {
            var availableBoons = new
            {
                DuoBoons = await GetAvailableDuoBoons(selectedBoonIds),
                LegendaryBoons = await GetAvailableLegendaryBoons(selectedBoonIds)
            };

            return Ok(availableBoons);
        }

        private async Task<List<object>> GetAvailableDuoBoons(List<int> selectedBoonIds)
        {
            var duoBoons = await _context.DuoBoons
                .Include(d => d.Prerequisites)
                .Include(d => d.FirstGod)
                .Include(d => d.SecondGod)
                .ToListAsync();

            var availableDuoBoons = new List<object>();

            foreach (var duoBoon in duoBoons)
            {
                var isAvailable = CheckBoonPrerequisites(duoBoon.Prerequisites, selectedBoonIds);

                availableDuoBoons.Add(new
                {
                    duoBoon.BoonId,
                    duoBoon.Name,
                    duoBoon.IconUrl,
                    duoBoon.Description,
                    duoBoon.Effect,
                    Type = "Duo",
                    FirstGod = new { duoBoon.FirstGod.GodId, duoBoon.FirstGod.Name, duoBoon.FirstGod.IconUrl },
                    SecondGod = new { duoBoon.SecondGod.GodId, duoBoon.SecondGod.Name, duoBoon.SecondGod.IconUrl },
                    IsAvailable = isAvailable
                });
            }

            return availableDuoBoons;
        }

        private async Task<List<object>> GetAvailableLegendaryBoons(List<int> selectedBoonIds)
        {
            var legendaryBoons = await _context.Boons
                .Where(b => b.Type == BoonType.Legendary)
                .Include(b => b.Prerequisites)
                .Include(b => b.God)
                .ToListAsync();

            var availableLegendaryBoons = new List<object>();

            foreach (var legendaryBoon in legendaryBoons)
            {
                var isAvailable = CheckBoonPrerequisites(legendaryBoon.Prerequisites, selectedBoonIds);

                availableLegendaryBoons.Add(new
                {
                    legendaryBoon.BoonId,
                    legendaryBoon.Name,
                    legendaryBoon.IconUrl,
                    legendaryBoon.Description,
                    legendaryBoon.Effect,
                    Type = "Legendary",
                    God = legendaryBoon.God != null ? new { legendaryBoon.God.GodId, legendaryBoon.God.Name, legendaryBoon.God.IconUrl } : null,
                    IsAvailable = isAvailable
                });
            }

            return availableLegendaryBoons;
        }

        private bool CheckBoonPrerequisites(ICollection<BoonPrerequisite> prerequisites, List<int> selectedBoonIds)
        {
            if (!prerequisites.Any()) return false;

            // Group prerequisites by AlternativeGroupId
            var prerequisiteGroups = prerequisites
                .GroupBy(p => p.AlternativeGroupId)
                .ToList();

            // Check if all groups are satisfied
            foreach (var group in prerequisiteGroups)
            {
                // At least one boon from each group must be selected
                bool groupSatisfied = group.Any(p => selectedBoonIds.Contains(p.RequiredBoonId));
                if (!groupSatisfied)
                {
                    return false;
                }
            }

            return true;
        }

        // GET: api/boons/prerequisites/{boonId}
        [HttpGet("prerequisites/{boonId}")]
        public async Task<ActionResult<object>> GetBoonPrerequisites(int boonId)
        {
            var boon = await _context.Boons
                .Include(b => b.Prerequisites)
                    .ThenInclude(p => p.RequiredBoon)
                        .ThenInclude(rb => rb.God)
                .FirstOrDefaultAsync(b => b.BoonId == boonId);

            if (boon == null)
            {
                return NotFound($"Boon with ID {boonId} not found");
            }

            var prerequisiteGroups = boon.Prerequisites
                .GroupBy(p => p.AlternativeGroupId)
                .Select(group => new
                {
                    GroupId = group.Key,
                    IsAlternativeGroup = group.First().IsAlternative,
                    Description = group.First().IsAlternative ? "Any one of these boons" : "All of these boons",
                    RequiredBoons = group.Select(p => new
                    {
                        p.RequiredBoon.BoonId,
                        p.RequiredBoon.Name,
                        p.RequiredBoon.IconUrl,
                        p.RequiredBoon.Slot,
                        God = p.RequiredBoon.God != null ? new
                        {
                            p.RequiredBoon.God.GodId,
                            p.RequiredBoon.God.Name,
                            p.RequiredBoon.God.IconUrl
                        } : null
                    })
                })
                .ToList();

            return Ok(new
            {
                BoonId = boon.BoonId,
                BoonName = boon.Name,
                BoonType = boon.Type.ToString(),
                PrerequisiteGroups = prerequisiteGroups,
                HasPrerequisites = prerequisiteGroups.Any()
            });
        }
    }
}