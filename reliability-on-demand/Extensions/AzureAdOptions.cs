// Taken from: https://microsoft.visualstudio.com/OS.Fun/_git/reliability.cloud?path=%2Freliability.cloud.ui%2FExtensions%2FAzureAdOptions.cs

// https://github.com/Azure-Samples/active-directory-dotnet-webapp-openidconnect-aspnetcore/blob/master/Extensions/AzureAdOptions.cs
namespace reliability_on_demand.Extensions
{
    public class AzureAdOptions
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string Instance { get; set; }
        public string Domain { get; set; }
        public string TenantId { get; set; }
        public string CallbackPath { get; set; }
    }
}
