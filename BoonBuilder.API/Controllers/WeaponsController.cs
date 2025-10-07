using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BoonBuilder.Data;
using BoonBuilder.Models;

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