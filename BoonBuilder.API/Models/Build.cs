namespace BoonBuilder.Models
{
    public class Build
    {
        public int BuildId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string AuthorId { get; set; } = string.Empty;
        public int WeaponAspectId { get; set; }
        public int? FamiliarId { get; set; } // Optional familiar selection
        public BuildDifficulty Difficulty { get; set; }
        public BuildTier Tier { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsPublic { get; set; }
        public int LikeCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string PlaystyleTags { get; set; } = string.Empty; // JSON array of tags

        // Navigation properties
        public ApplicationUser Author { get; set; } = null!;
        public WeaponAspect WeaponAspect { get; set; } = null!;
        public Familiar? Familiar { get; set; } // Optional familiar relationship
        public ICollection<BuildBoon> BuildBoons { get; set; } = new List<BuildBoon>();
        public ICollection<UserFavorite> Favorites { get; set; } = new List<UserFavorite>();
    }

    public class BuildBoon
    {
        public int BuildBoonId { get; set; }
        public int BuildId { get; set; }
        public int BoonId { get; set; }
        public BoonSlot? Slot { get; set; }
        public int Order { get; set; } // For display order

        // Navigation properties
        public Build Build { get; set; } = null!;
        public Boon Boon { get; set; } = null!;
    }

    public class UserFavorite
    {
        public int FavoriteId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int BuildId { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public ApplicationUser User { get; set; } = null!;
        public Build Build { get; set; } = null!;
    }
}