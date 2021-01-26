using System.ComponentModel.DataAnnotations;

namespace reliability_on_demand.DataLayer
{
    public class StackHashCategory
    {
        [Key]
        public int ID { get; set; }
        public string Name { get; set; }
    }
}
