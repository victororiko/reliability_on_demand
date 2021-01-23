// taken from: https://microsoft.visualstudio.com/OS.Fun/_git/reliability.cloud?path=%2Freliability.cloud%2FKustoCredentials.cs
using Kusto.Data;

namespace reliability_on_demand.Helpers
{
    // https://kusto.azurewebsites.net/docs/api/netfx/about-the-sdk.html?q=sdk 
    public class KustoCredentials
    {
        public string KustoAppIdRelCloud { get; set; }
        public string KustoAppKeyRelCloud { get; set; }
        public string KustoClusterEndpoint { get; set; }

        public KustoConnectionStringBuilder KustoConnection
        {
            get
            {
                // Note: only AAD application authentication is supported when running in a .NET Standard application.
                //       AAD user authentication is not supported due to the (intended) lack of implementation of 
                //       UI components in the standard version of framework.
                return new KustoConnectionStringBuilder(KustoClusterEndpoint)
                {
                    FederatedSecurity = true,
                    ApplicationClientId = KustoAppIdRelCloud,
                    ApplicationKey = KustoAppKeyRelCloud,
                    Authority = "microsoft.com"
                };
            }
        }
    }
}
