using System;
namespace reliability_on_demand.DataLayer
{
    public class RelUnifiedConfig
    {
        /*
         * Columns: 
         * ConfigID
         * CreationDate
         * LastCacheDate
         * ExpiryDate
         * ConfigName
         * OwnerContact
         * OwnerTeam
         * CacheFrequency
         */
        public Guid ConfigID { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastCacheDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string ConfigName { get; set; }
        public string OwnerContact { get; set; }
        public string OwnerTeam { get; set; }
        public int CacheFrequency { get; set; }

    }
}
