using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BoonBuilder.Data;
using BoonBuilder.Models;
using BoonBuilder.Models.DTOs;
using BoonBuilder.Services;

namespace BoonBuilder.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BuildsController : ControllerBase
    {
        private readonly BoonBuilderContext _context;
        private readonly IBuildService _buildService;

        public BuildsController(BoonBuilderContext context, IBuildService buildService)
        {
            _context = context;
            _buildService = buildService;
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
                {
                    build.WeaponAspect.Weapon.Name,
                    build.WeaponAspect.Weapon.IconUrl
                },
                Aspect = new
                {
                    build.WeaponAspect.Name,
                    build.WeaponAspect.IconUrl
                },
                build.Difficulty,
                build.Tier,
                build.LikeCount,
                build.IsFeatured,
                build.PlaystyleTags,
                build.CreatedAt,
                build.UpdatedAt,
                Boons = build.BuildBoons.OrderBy(bb => bb.Order).Select(bb => new
                {
                    bb.BoonId,
                    bb.Boon.Name,
                    bb.Boon.IconUrl,
                    bb.Boon.Description,
                    bb.Boon.Effect,
                    bb.Slot,
                    GodName = bb.Boon.God != null ? bb.Boon.God.Name : null
                })
            };
        }

        // POST: api/builds
        [HttpPost]
        public async Task<ActionResult<object>> CreateBuild([FromBody] CreateBuildRequest request)
        {
            // For simplicity, use a default user ID. In production, get from JWT token
            var userId = await GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }

            var build = new Build
            {
                Name = request.Name,
                Description = request.Description,
                AuthorId = userId,
                WeaponAspectId = request.WeaponAspectId,
                Difficulty = request.Difficulty,
                Tier = request.Tier,
                IsFeatured = false,
                IsPublic = request.IsPublic,
                LikeCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                PlaystyleTags = request.PlaystyleTags ?? "[]"
            };

            await _context.Builds.AddAsync(build);
            await _context.SaveChangesAsync();

            // Add boons to the build
            if (request.Boons != null && request.Boons.Any())
            {
                var buildBoons = request.Boons.Select((boon, index) => new BuildBoon
                {
                    BuildId = build.BuildId,
                    BoonId = boon.BoonId,
                    Slot = boon.Slot,
                    Order = index + 1
                }).ToList();

                await _context.BuildBoons.AddRangeAsync(buildBoons);
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetBuild), new { id = build.BuildId }, new { build.BuildId, build.Name });
        }

        // PUT: api/builds/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<object>> UpdateBuild(int id, [FromBody] CreateBuildRequest request)
        {
            var userId = GetCurrentUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }

            var existingBuild = await _context.Builds.FindAsync(id);
            if (existingBuild == null)
            {
                return NotFound();
            }

            // Check if user owns the build
            if (existingBuild.AuthorId != userId)
            {
                return Forbid("You can only edit your own builds");
            }

            // Update build properties
            existingBuild.Name = request.Name;
            existingBuild.Description = request.Description;
            existingBuild.WeaponAspectId = request.WeaponAspectId;
            existingBuild.Difficulty = request.Difficulty;
            existingBuild.Tier = request.Tier;
            existingBuild.IsPublic = request.IsPublic;
            existingBuild.PlaystyleTags = request.PlaystyleTags ?? "[]";
            existingBuild.UpdatedAt = DateTime.UtcNow;

            // Remove existing build boons
            var existingBuildBoons = await _context.BuildBoons
                .Where(bb => bb.BuildId == id)
                .ToListAsync();
            _context.BuildBoons.RemoveRange(existingBuildBoons);

            // Add new build boons
            if (request.Boons != null && request.Boons.Any())
            {
                var buildBoons = request.Boons.Select((boon, index) => new BuildBoon
                {
                    BuildId = id,
                    BoonId = boon.BoonId,
                    Slot = boon.Slot,
                    Order = index + 1
                }).ToList();

                await _context.BuildBoons.AddRangeAsync(buildBoons);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Build updated successfully" });
        }

        // DELETE: api/builds/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteBuild(int id)
        {
            var userId = GetCurrentUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }

            var build = await _context.Builds.FindAsync(id);
            if (build == null)
            {
                return NotFound();
            }

            // Check if user owns the build
            if (build.AuthorId != userId)
            {
                return Forbid("You can only delete your own builds");
            }

            _context.Builds.Remove(build);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Build deleted successfully" });
        }

        // GET: api/builds/user/me
        [HttpGet("user/me")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetMyBuilds()
        {
            var userId = GetCurrentUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }

            var builds = await _buildService.GetUserBuildsAsync(userId);

            return Ok(builds.Select(b => new
            {
                b.BuildId,
                b.Name,
                b.Description,
                b.Difficulty,
                b.Tier,
                b.IsPublic,
                b.IsFeatured,
                b.LikeCount,
                b.UpdatedAt,
                Weapon = new
                {
                    b.WeaponAspect.Weapon.Name,
                    b.WeaponAspect.Weapon.IconUrl
                },
                Aspect = new
                {
                    b.WeaponAspect.Name,
                    b.WeaponAspect.IconUrl
                }
            }));
        }

        // GET: api/builds/favorites
        [HttpGet("favorites")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetFavoriteBuilds()
        {
            var userId = GetCurrentUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }

            var builds = await _buildService.GetFavoriteBuildsAsync(userId);

            return Ok(builds.Select(b => new
            {
                b.BuildId,
                b.Name,
                b.Description,
                Author = new
                {
                    b.Author.DisplayName
                },
                b.Difficulty,
                b.Tier,
                b.LikeCount,
                b.UpdatedAt,
                Weapon = new
                {
                    b.WeaponAspect.Weapon.Name,
                    b.WeaponAspect.Weapon.IconUrl
                },
                Aspect = new
                {
                    b.WeaponAspect.Name,
                    b.WeaponAspect.IconUrl
                }
            }));
        }

        // POST: api/builds/5/favorite
        [HttpPost("{id}/favorite")]
        [Authorize]
        public async Task<ActionResult> AddToFavorites(int id)
        {
            var userId = GetCurrentUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }

            var success = await _buildService.AddToFavoritesAsync(userId, id);
            if (!success)
            {
                return BadRequest(new { message = "Build already in favorites or not found" });
            }

            return Ok(new { message = "Build added to favorites" });
        }

        // DELETE: api/builds/5/favorite
        [HttpDelete("{id}/favorite")]
        [Authorize]
        public async Task<ActionResult> RemoveFromFavorites(int id)
        {
            var userId = GetCurrentUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }

            var success = await _buildService.RemoveFromFavoritesAsync(userId, id);
            if (!success)
            {
                return BadRequest(new { message = "Build not in favorites or not found" });
            }

            return Ok(new { message = "Build removed from favorites" });
        }

        private string GetCurrentUserIdFromClaims()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
        }

        private async Task<string> GetCurrentUserId()
        {
            // For now, return the test user ID. In production, extract from JWT
            var testUser = await _context.Users.FirstOrDefaultAsync(u => u.UserName == "test123");
            return testUser?.Id ?? "";
        }
    }

    public class CreateBuildRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int WeaponAspectId { get; set; }
        public BuildDifficulty Difficulty { get; set; }
        public BuildTier Tier { get; set; }
        public bool IsPublic { get; set; } = true;
        public string? PlaystyleTags { get; set; }
        public List<CreateBuildBoonRequest>? Boons { get; set; }
    }

    public class CreateBuildBoonRequest
    {
        public int BoonId { get; set; }
        public BoonSlot? Slot { get; set; }
    }
}