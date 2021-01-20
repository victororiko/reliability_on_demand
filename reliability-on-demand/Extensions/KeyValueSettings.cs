using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace reliability_on_demand.Extensions
{
    public class KeyVaultSettings
    {
        public string Vault { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
    }
}
