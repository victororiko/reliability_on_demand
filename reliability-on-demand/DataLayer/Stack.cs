using System.ComponentModel.DataAnnotations;

namespace reliability_on_demand.DataLayer
{
    public class Stack
    {
        [Key]
        public string StackHash { get; set; }

        public int CabCount { get; set; }

        public int Category { get; set; }

        public int TotalCabCount { get; set; }

        public bool IsLoaded { get; set; }

        public string StackTree { get; set; } = string.Empty;

        public long IndexN { get; set; }
    }
}
