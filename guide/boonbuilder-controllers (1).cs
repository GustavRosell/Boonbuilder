// Controllers/BoonsController.cs
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
                    GodName = g.First().God.Name,
                    GodIcon = g.First().God.IconUrl,
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

// Controllers/GodsController.cs
namespace BoonBuilder.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GodsController : ControllerBase
    {
        private readonly BoonBuilderContext _context;

        public GodsController(BoonBuilderContext context)
        {
            _context = context;
        }

        // GET: api/gods
        [HttpGet]
        public async Task<ActionResult<IEnumerable<God>>> GetGods()
        {
            return await _context.Gods.ToListAsync();
        }

        // GET: api/gods/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetGod(int id)
        {
            var god = await _context.Gods
                .Include(g => g.Boons)
                .FirstOrDefaultAsync(g => g.GodId == id);

            if (god == null)
            {
                return NotFound();
            }

            return new
            {
                god.GodId,
                god.Name,
                god.IconUrl,
                god.PrimaryElement,
                god.SecondaryElement,
                god.StatusEffect,
                god.Description,
                Boons = god.Boons.Select(b => new
                {
                    b.BoonId,
                    b.Name,
                    b.Type,
                    b.Slot,
                    b.IconUrl
                })
            };
        }
    }
}

// Controllers/WeaponsController.cs
namespace BoonBuilder.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeaponsController : ControllerBase
    {
        private readonly BoonBuilderContext _context;

        public WeaponsController(BoonBuilderContext context)
        {
            _context = context;
        }

        // GET: api/weapons
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetWeapons()
        {
            var weapons = await _context.Weapons
                .Include(w => w.Aspects)
                .Select(w => new
                {
                    w.WeaponId,
                    w.Type,
                    w.Name,
                    w.IconUrl,
                    w.Description,
                    Aspects = w.Aspects.Select(a => new
                    {
                        a.AspectId,
                        a.Name,
                        a.IconUrl,
                        a.Description,
                        a.IsHidden
                    })
                })
                .ToListAsync();

            return Ok(weapons);
        }
    }
}

// Controllers/BuildsController.cs
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BoonBuilder.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BuildsController : ControllerBase
    {
        private readonly BoonBuilderContext _context;

        public BuildsController(BoonBuilderContext context)
        {
            _context = context;
        }

        // GET: api/builds
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetBuilds(
            [FromQuery] BuildTier? tier = null,
            [FromQuery] int? weaponId = null,
            [FromQuery] bool featured = false)
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

            var builds = await query
                .OrderByDescending(b => b.LikeCount)
                .ThenByDescending(b => b.UpdatedAt)
                .Select(b => new
                {
                    b.BuildId,
                    b.Name,
                    b.Description,
                    Author = new
                    {
                        b.Author.DisplayName
                    },
                    Weapon = new
                    {
                        b.WeaponAspect.Weapon.Name,
                        b.WeaponAspect.Weapon.IconUrl
                    },
                    Aspect = new
                    {
                        b.WeaponAspect.Name,
                        b.WeaponAspect.IconUrl
                    },
                    b.Difficulty,
                    b.Tier,
                    b.LikeCount,
                    b.IsFeatured,
                    b.PlaystyleTags,
                    b.UpdatedAt,
                    Boons = b.BuildBoons.OrderBy(bb => bb.Order).Select(bb => new
                    {
                        bb.BoonId,
                        bb.Boon.Name,
                        bb.Boon.IconUrl,
                        bb.Slot,
                        GodName = bb.Boon.God != null ? bb.Boon.God.Name : null
                    })
                })
                .ToListAsync();

            return Ok(builds);
        }

        // GET: api/builds/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetBuild(int id)
        {
            var build = await _context.Builds
                .Include(b => b.Author)
                .Include(b => b.WeaponAspect)
                    .ThenInclude(wa => wa.Weapon)
                .Include(b => b.BuildBoons)
                    .ThenInclude(bb => bb.Boon)
                        .ThenInclude(b => b.God)
                .FirstOrDefaultAsync(b => b.BuildId == id);

            if (build == null)
            {
                return NotFound();
            }

            return new
            {
                build.BuildId,
                build.Name,
                build.Description,
                Author = new
                {
                    build.Author.Id,
                    build.Author.DisplayName
                },
                Weapon = new
                