// Original function app: RIODFilterExpressionValidator
// INCOMPLETE

#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


public class Pivot
{
        public int PivotID { get; set; }
        public string PivotName { get; set; }
        public bool IsSelectPivot { get; set; }
        public bool IsKeyPivot { get; set; }
        public bool IsApportionPivot { get; set; }
        public bool IsApportionJoinPivot { get; set; }
        public bool IsScopeFilter { get; set; }
        public int PivotScopeID { get; set; }
        public string FilterExpression { get; set; }
        public string FilterExpressionOperator { get; set; }
}

public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string name = req.Query["name"].ToString();

    /*
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    name = name ?? data?.name;
    */

    string responseMessage = string.IsNullOrEmpty(name)
        ? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
                : $"Hello, {name}. This HTTP triggered function executed successfully.";

        bool isValid = true;
        IActionResult ret = (ActionResult)new OkObjectResult(responseMessage);
        return ret;
}
