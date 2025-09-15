namespace BoonBuilder.Models
{
    public class Pet
    {
        public int PetId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string IconUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsHidden { get; set; } = false;

        // Navigation properties
        public ICollection<Build> Builds { get; set; } = new List<Build>();
    }
}