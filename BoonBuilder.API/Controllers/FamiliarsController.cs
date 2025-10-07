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
        public async Task<ActionResult<IEnumerable<Familiar>>> GetFamiliars()
        {
            return await _context.Familiars
                .Where(f => !f.IsHidden)
                .OrderBy(f => f.FamiliarId)
                .ToListAsync();
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