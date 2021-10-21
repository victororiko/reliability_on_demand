using System.ComponentModel.DataAnnotations;

namespace reliability_on_demand.DataLayer
{
    public class TeamConfig
    {
        [Key]
        public int TeamID { get; set; }
        public string OwnerContact { get; set; }
        public string OwnerTeamFriendlyName { get; set; }
        public string OwnerTriageAlias { get; set; }
    }
}
