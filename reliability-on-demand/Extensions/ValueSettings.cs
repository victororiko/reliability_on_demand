using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace reliability_on_demand.Extensions
{
    public class ValueSettings
    {
        public string AzureStorageConnectionString { get; set; }
        public string KustoAppId { get; set; }
        public string KustoAppKey { get; set; }
        public string SQLConnectionString { get; set; }
        public string VSOAccessToken { get; set; }
        public string VsoClientAssertion { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
    }
}
