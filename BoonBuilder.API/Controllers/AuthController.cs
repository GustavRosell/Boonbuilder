using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using BoonBuilder.Models;
using BoonBuilder.Models.DTOs;
using System.Security.Claims;

namespace BoonBuilder.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid input data"
                    });
                }

                // Check if username already exists
                var existingUser = await _userManager.FindByNameAsync(request.Username);
                if (existingUser != null)
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Username already exists"
                    });
                }

                // Check if email already exists
                var existingEmail = await _userManager.FindByEmailAsync(request.Email);
                if (existingEmail != null)
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Email already exists"
                    });
                }

                var user = new ApplicationUser
                {
                    UserName = request.Username,
                    Email = request.Email,
                    DisplayName = request.DisplayName,
                    CreatedAt = DateTime.UtcNow,
                    EmailConfirmed = true // For development, skip email confirmation
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);

                    return Ok(new AuthResponse
                    {
                        Success = true,
                        Message = "Registration successful",
                        User = new UserInfo
                        {
                            Id = user.Id,
                            Username = user.UserName!,
                            Email = user.Email!,
                            DisplayName = user.DisplayName,
                            CreatedAt = user.CreatedAt
                        }
                    });
                }
                else
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = string.Join(", ", result.Errors.Select(e => e.Description))
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during registration"
                });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid input data"
                    });
                }

                var result = await _signInManager.PasswordSignInAsync(
                    request.Username,
                    request.Password,
                    isPersistent: false,
                    lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync(request.Username);

                    return Ok(new AuthResponse
                    {
                        Success = true,
                        Message = "Login successful",
                        User = new UserInfo
                        {
                            Id = user!.Id,
                            Username = user.UserName!,
                            Email = user.Email!,
                            DisplayName = user.DisplayName,
                            CreatedAt = user.CreatedAt
                        }
                    });
                }
                else
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid username or password"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user login");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during login"
                });
            }
        }

        [HttpPost("logout")]
        public async Task<ActionResult<AuthResponse>> Logout()
        {
            try
            {
                await _signInManager.SignOutAsync();

                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "Logout successful"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user logout");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during logout"
                });
            }
        }

        [HttpGet("me")]
        public async Task<ActionResult<AuthResponse>> GetCurrentUser()
        {
            try
            {
                if (!User.Identity?.IsAuthenticated ?? false)
                {
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "Not authenticated"
                    });
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _userManager.FindByIdAsync(userId!);

                if (user == null)
                {
                    return NotFound(new AuthResponse
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "User retrieved successfully",
                    User = new UserInfo
                    {
                        Id = user.Id,
                        Username = user.UserName!,
                        Email = user.Email!,
                        DisplayName = user.DisplayName,
                        CreatedAt = user.CreatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current user");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred retrieving user information"
                });
            }
        }

        [HttpGet("check")]
        public IActionResult CheckAuth()
        {
            return Ok(new AuthResponse
            {
                Success = User.Identity?.IsAuthenticated ?? false,
                Message = User.Identity?.IsAuthenticated == true ? "Authenticated" : "Not authenticated"
            });
        }
    }
}