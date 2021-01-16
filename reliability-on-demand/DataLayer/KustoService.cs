using reliability_on_demand.Helpers;
using Microsoft.Extensions.Options;
using Kusto.Data.Net.Client;

namespace reliability_on_demand.DataLayer
{
    public class KustoService : IKustoService
    {
        KustoCredentials _credentials;

        public KustoService(IOptions<KustoCredentials> credentials)
        {
            _credentials = credentials.Value;
        }

        public string GetAllReleases()
        {
            return GetKustoResults($"GetJSON_GetAllReleasesForPromotedBugs()");
        }

        public string GetKustoResults(string query)
        {
            using (var queryProvider = KustoClientFactory.CreateCslQueryProvider(_credentials.KustoConnection))
            {
                using (var reader = queryProvider.ExecuteQuery(query))
                {
                    if (reader.Read())
                    {
                        return reader["JValue"].ToString();
                    }
                    else
                    {
                        return "{\"Error\": \"Query did not return data\"}";
                    }
                }
            }
        }
    }
}