using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BoonBuilder.Data;
using BoonBuilder.Models;

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