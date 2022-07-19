using System;
using System.ComponentModel.DataAnnotations;

namespace reliability_on_demand.DataLayer
{
    public class StudyConfig
    {
        public string StudyConfigID { get; set; }
        public string StudyName { get; set; }
        public DateTime LastRefreshDate { get; set; }
        public int CacheFrequency { get; set; }
        public DateTime Expiry { get; set; }
        public int TeamID { get; set; }
        public int ObservationWindowDays { get; set; }
    }
}
