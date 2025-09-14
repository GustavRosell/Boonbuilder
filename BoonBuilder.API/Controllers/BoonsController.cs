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

        // GET: api/boons/available
        [HttpPost("available")]
        public async Task<ActionResult<IEnumerable<object>>> GetAvailableBoons([FromBody] List<int> selectedBoonIds)
        {
            // Get all duo boons
            var duoBoons = await _context.DuoBoons
                .Include(d => d.Prerequisites)
                .ToListAsync();

            var availableDuoBoons = new List<object>();

            foreach (var duoBoon in duoBoons)
            {
                // Group prerequisites by AlternativeGroupId
                var prerequisiteGroups = duoBoon.Prerequisites
                    .GroupBy(p => p.AlternativeGroupId)
                    .ToList();

                // Check if all groups are satisfied
                bool allGroupsSatisfied = true;
                foreach (var group in prerequisiteGroups)
                {
                    // At least one boon from each group must be selected
                    bool groupSatisfied = group.Any(p => selectedBoonIds.Contains(p.RequiredBoonId));
                    if (!groupSatisfied)
                    {
                        allGroupsSatisfied = false;
                        break;
                    }
                }

                if (allGroupsSatisfied && prerequisiteGroups.Any())
                {
                    availableDuoBoons.Add(new
                    {
                        duoBoon.BoonId,
                        duoBoon.Name,
                        duoBoon.IconUrl,
                        IsAvailable = true
                    });
                }
            }

            return Ok(availableDuoBoons);
        }
    }
}