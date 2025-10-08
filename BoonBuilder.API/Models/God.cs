namespace BoonBuilder.Models
{
    public class God
    {
        public int GodId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string IconUrl { get; set; } = string.Empty;
        public string? InfusionIconUrl { get; set; }
        public ElementType? PrimaryElement { get; set; }
        public ElementType? SecondaryElement { get; set; }
        public string StatusEffect { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Navigation properties
        public ICollection<Boon> Boons { get; set; } = new List<Boon>();
        public ICollection<DuoBoon> PrimaryDuoBoons { get; set; } = new List<DuoBoon>();
        public ICollection<DuoBoon> SecondaryDuoBoons { get; set; } = new List<DuoBoon>();
    }
}