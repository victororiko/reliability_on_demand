// Taken from: https://microsoft.visualstudio.com/OS.Fun/_git/reliability.cloud?path=%2Freliability.cloud.ui%2FExtensions%2FValueSettings.cs

namespace reliability_on_demand.Extensions
{
    public class KeyVaultSettings
    {
        public string Vault { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
    }
}
