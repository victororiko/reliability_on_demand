// Original function app: RIODFeederTemplateFunctions

#r "Newtonsoft.Json"
#r "Microsoft.IdentityModel.Clients.ActiveDirectory"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
class CosmosAccess
{
public string SubmitServerlessQuery()
{
                string AadInstance = "https://login.microsoftonline.com/{0}";
                string ResourceId = "https://database.windows.net/";
                string  CosmosServicePrincipalTenantID = System.Environment.GetEnvironmentVariable("CosmosServicePrincipalTenantID");
                string  CosmosServicePrincipalAppID = System.Environment.GetEnvironmentVariable("CosmosServicePrincipalAppID");
                string  CosmosServicePrincipalSecret = System.Environment.GetEnvironmentVariable("CosmosServicePrincipalSecret");
                string  connectionString = System.Environment.GetEnvironmentVariable("CosmosServerlessSQL");

                AuthenticationContext authenticationContext = new AuthenticationContext(string.Format(AadInstance, CosmosServicePrincipalTenantID));

                ClientCredential clientCredential = new ClientCredential(CosmosServicePrincipalAppID, CosmosServicePrincipalSecret);

                AuthenticationResult authenticationResult = authenticationContext.AcquireTokenAsync(ResourceId, clientCredential).Result;
                string str="";
                using (var conn = new SqlConnection(connectionString))
                {
                    conn.AccessToken = authenticationResult.AccessToken;
                    conn.Open();
                    string sqlScript = @"SELECT * FROM OPENROWSET(
                                      BULK 'adl://asimov-prod-data-c15.azuredatalakestore.net/local/PublicPartner/Processed/Reliability/RIOD/Streams/RIOD_Device_Failures.ss',
                                      FORMAT = 'SStream', 
                                      PARSER_VERSION='2.0'
                                    ) AS a;";

                    
                    using (var cmd = new SqlCommand(sqlScript, conn))
                    {
                        var reader = cmd.ExecuteReader();
                        while (reader.Read())
                        {
                            str = str +" "+reader[0] ;
                        }
                        
                    }
                }
                return str;
}
}


public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string name = req.Query["name"];

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    name = name ?? data?.name;

    string responseMessage = string.IsNullOrEmpty(name)
        ? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
                : $"Hello, {name}. This HTTP triggered function executed successfully.";

        CosmosAccess cs = new CosmosAccess();
                String st = cs.SubmitServerlessQuery();

            return new OkObjectResult(st);
}