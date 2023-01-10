// taken from: https://microsoft.visualstudio.com/OS.Fun/_git/reliability.cloud?path=%2Freliability.cloud.ui%2FDataLayer%2FKustoService.cs
using Kusto.Data.Net.Client;
using Microsoft.Extensions.Options;
using reliability_on_demand.Helpers;

namespace reliability_on_demand.DataLayer
{
    public class KustoService : IKustoService
    {
        KustoCredentials _credentials;

        public KustoService(IOptions<KustoCredentials> credentials)
        {
            _credentials = credentials.Value;
        }

        public string GetStudyInstances(int studyConfigID)
        {
            return GetKustoResults($"RIOD_JSON_Get_StudyInstances_Latest(studyConfigID = {studyConfigID})");
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