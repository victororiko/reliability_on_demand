using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using reliability_on_demand.Extensions;
using System.Text;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Data.SqlClient;
using System;

// please try to use capitalization style specified in .NET documentation - https://docs.microsoft.com/en-us/previous-versions/dotnet/netframework-1.1/x2dbyw72(v=vs.71)
namespace reliability_on_demand.DataLayer
{
    public class RIODCosmosDbContext : DbContext
    {
        public DbSet<TeamConfig> TeamConfigs { get; set;}
        private string connectionString = null;
        private string CosmosServicePrincipalSecret = null;
        private string CosmosServicePrincipalTenantID = null;
        private string CosmosServicePrincipalAppID = null;

        private string validateAzureFunctionKey = null;

        public RIODCosmosDbContext(IOptions<ValueSettings> valueSettings, DbContextOptions<RIODCosmosDbContext> options) : base(options)
        {
            connectionString = valueSettings.Value.CosmosServerlessSQL;
            validateAzureFunctionKey = valueSettings.Value.FailureValidateAzureFunction;
            CosmosServicePrincipalSecret = valueSettings.Value.CosmosServicePrincipalSecret;
            CosmosServicePrincipalTenantID = valueSettings.Value.CosmosServicePrincipalTenantID;
            CosmosServicePrincipalAppID = valueSettings.Value.CosmosServicePrincipalAppID;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.UseSqlServer(connectionString);
        }

        //Sample method on how to query the cosmos using the serverless queue
        public void SubmitServerlessQuery()
        {
            try
            {
                string AadInstance = "https://login.windows.net/{0}";
                string ResourceId = "https://database.windows.net/";
                AuthenticationContext authenticationContext = new AuthenticationContext(string.Format(AadInstance, CosmosServicePrincipalTenantID));

                ClientCredential clientCredential = new ClientCredential(CosmosServicePrincipalAppID, CosmosServicePrincipalSecret);

                AuthenticationResult authenticationResult = authenticationContext.AcquireTokenAsync(ResourceId, clientCredential).Result;

                using (var conn = new SqlConnection(connectionString))
                {
                    conn.AccessToken = authenticationResult.AccessToken;
                    conn.Open();
                    string sqlScript = @"SELECT TOP 10 BuildNumber FROM OPENROWSET(
                                      BULK 'adl://asimov-prod-data-c15.azuredatalakestore.net/local/PublicPartner/Processed/Reliability/RIOD/Streams/RIOD.DevicePopulation.ss',
                                      FORMAT = 'SStream', 
                                      PARSER_VERSION='2.0'
                                    ) AS a;";

                    using (var cmd = new SqlCommand(sqlScript, conn))
                    {
                        var reader = cmd.ExecuteReader();
                        while (reader.Read())
                        {
                            Console.WriteLine(String.Format("{0}", reader[0]));
                        }
                    }
                }
                Console.ReadKey();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

    }
}
