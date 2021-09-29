/*
 * Project created using: https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/react?view=aspnetcore-5.0&tabs=visual-studio
 */

// To better understand entry point go here - https://app.pluralsight.com/course-player?clipId=f0dd38a1-c780-4b43-9f53-b9fc6be24c01
// Adapted from: https://microsoft.visualstudio.com/OS.Fun/_git/reliability.cloud?path=%2Freliability.cloud.ui%2FProgram.cs
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using reliability_on_demand.Extensions;
using System.IO;
using System;
using Microsoft.Extensions.DependencyInjection;

namespace reliability_on_demand
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args);

            var config = host.Services.GetRequiredService<IConfiguration>();

            foreach (var c in config.AsEnumerable())
            {
                Console.WriteLine(c.Key + " = " + c.Value);
            }
            host.Run();
        }

        public static IWebHost CreateHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    config.SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile("appsettings.json", optional: false)
                        .AddEnvironmentVariables();

                    var builtConfig = config.Build();
                    var settings = builtConfig.GetSection("KeyVault").Get<KeyVaultSettings>();

                    // reference documentation - https://docs.microsoft.com/en-us/aspnet/core/security/key-vault-configuration?view=aspnetcore-5.0#use-managed-identities-for-azure-resources
                    config.AddAzureKeyVault(
                        settings.Vault, settings.ClientId, settings.ClientSecret);

                })
                //.UseApplicationInsights() --> this used to work in Microsoft.AspNetCore 2.0 ----> need to check how it translates to 3.0
                .UseStartup<Startup>()
                .Build();
    }
}
