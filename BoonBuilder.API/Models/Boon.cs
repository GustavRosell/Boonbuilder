namespace BoonBuilder.Models
{
    public class Boon
    {
        public int BoonId { get; set; }
        public string Name { get; set; } = string.Empty;
        public BoonType Type { get; set; }
        public int? GodId { get; set; }
        public BoonSlot? Slot { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Effect { get; set; } = string.Empty;
        public string IconUrl { get; set; } = string.Empty;
        public ElementType? Element { get; set; }
        public string StatusEffect { get; set; } = string.Empty;
        public bool IsPassive { get; set; }

        // Navigation properties
        public God? God { get; set; }
        public ICollection<BoonPrerequisite> Prerequisites { get; set; } = new List<BoonPrerequisite>();
        public ICollection<BoonPrerequisite> RequiredFor { get; set; } = new List<BoonPrerequisite>();
        public ICollection<BoonRarityValue> RarityValues { get; set; } = new List<BoonRarityValue>();
        public ICollection<BuildBoon> BuildBoons { get; set; } = new List<BuildBoon>();
    }

    public class DuoBoon : Boon
    {
        public int FirstGodId { get; set; }
        public int SecondGodId { get; set; }

        // Navigation properties
        public God FirstGod { get; set; } = null!;
        public God SecondGod { get; set; } = null!;
    }

    public class BoonRarityValue
    {
        public int RarityValueId { get; set; }
        public int BoonId { get; set; }
        public BoonRarity Rarity { get; set; }
        public string Value { get; set; } = string.Empty; // Can be damage, percentage, duration, etc.
        public string Description { get; set; } = string.Empty;

        // Navigation properties
        public Boon Boon { get; set; } = null!;
    }

    public class BoonPrerequisite
    {
        public int PrerequisiteId { get; set; }
        public int BoonId { get; set; }
        public int RequiredBoonId { get; set; }
        public bool IsAlternative { get; set; } // For OR relationships
        public int AlternativeGroupId { get; set; } // Groups alternatives together

        // Navigation properties
        public Boon Boon { get; set; } = null!;
        public Boon RequiredBoon { get; set; } = null!;
    }
}