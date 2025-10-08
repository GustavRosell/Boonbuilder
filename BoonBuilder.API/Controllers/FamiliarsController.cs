using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BoonBuilder.Data;
using BoonBuilder.Models;

namespace BoonBuilder.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FamiliarsController : ControllerBase
    {
        private readonly BoonBuilderContext _context;

        public FamiliarsController(BoonBuilderContext context)
        {
            _context = context;
        }

        // GET: api/familiars
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetFamiliars()
        {
            var familiars = await _context.Familiars
                .Include(f => f.Abilities)
                .Where(f => !f.IsHidden)
                .Select(f => new
                {
                    f.FamiliarId,
                    f.Name,
                    f.IconUrl,
                    f.Description,
                    f.IsHidden,
                    Abilities = f.Abilities.Select(a => new
                    {
                        a.AbilityId,
                        a.FamiliarId,
                        a.Name,
                        a.IconUrl,
                        a.Description,
                        a.IsHidden
                    })
                })
                .OrderBy(f => f.FamiliarId)
                .ToListAsync();

            return Ok(familiars);
        }

        // GET: api/familiars/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Familiar>> GetFamiliar(int id)
        {
            var familiar = await _context.Familiars.FindAsync(id);

            if (familiar == null)
            {
                return NotFound();
            }

            return familiar;
        }
    }
}