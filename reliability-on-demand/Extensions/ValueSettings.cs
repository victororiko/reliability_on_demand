// Taken from: https://microsoft.visualstudio.com/OS.Fun/_git/reliability.cloud?path=%2Freliability.cloud.ui%2FExtensions%2FValueSettings.cs

namespace reliability_on_demand.Extensions
{
    public class ValueSettings
    {
        public string AzureStorageConnectionString { get; set; }
        public string KustoAppId { get; set; }
        public string KustoAppKey { get; set; }
        public string relreportingdbsqlconn { get; set; }
        public string VSOAccessToken { get; set; }
        public string VsoClientAssertion { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
    }
}
