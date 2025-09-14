namespace BoonBuilder.Models
{
    public class Weapon
    {
        public int WeaponId { get; set; }
        public WeaponType Type { get; set; }
        public string Name { get; set; } = string.Empty;
        public string IconUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Navigation properties
        public ICollection<WeaponAspect> Aspects { get; set; } = new List<WeaponAspect>();
    }

    public class WeaponAspect
    {
        public int AspectId { get; set; }
        public int WeaponId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string IconUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsHidden { get; set; }

        // Navigation properties
        public Weapon Weapon { get; set; } = null!;
        public ICollection<Build> Builds { get; set; } = new List<Build>();
    }
}