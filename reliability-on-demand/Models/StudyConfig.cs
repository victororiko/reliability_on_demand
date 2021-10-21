using System;
using System.ComponentModel.DataAnnotations;

namespace reliability_on_demand.DataLayer
{
    public class StudyConfig
    {
        public string StudyName { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public int CacheFrequency { get; set; }
        public DateTime Expiry { get; set; }
        public int TeamId { get; set; }
        public int ObservationWindowDays { get; set; }
    }
}
