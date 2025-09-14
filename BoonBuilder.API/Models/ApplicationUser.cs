using Microsoft.AspNetCore.Identity;

namespace BoonBuilder.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public ICollection<Build> Builds { get; set; } = new List<Build>();
        public ICollection<UserFavorite> Favorites { get; set; } = new List<UserFavorite>();
    }
}