using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using reliability_on_demand.Extensions;
using Azure.Identity;


namespace reliability_on_demand
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Run();
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

                    config.AddAzureKeyVault(
                        settings.Vault, settings.ClientId, settings.ClientSecret);

                })
                //.UseApplicationInsights() --> this used to work in Microsoft.AspNetCore 2.0 ----> need to check how it translates to 3.0
                .UseStartup<Startup>()
                .Build();
    }
}
