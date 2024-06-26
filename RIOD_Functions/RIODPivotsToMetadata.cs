// Original function app: RIODStandardizeStudyPivots

#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    log.LogInformation("C# HTTP trigger function processed a request.");

    List<InputPivotEntry> list = data.ToObject<List<InputPivotEntry>>();

    string queryBit = "";
    foreach (InputPivotEntry e in list) {
        if(e.AggregateByPivot && queryBit.Equals("")) {
            queryBit = e.PivotName;
        } else if(e.AggregateByPivot) {
            queryBit += ", " + e.PivotName;
        }
    }


    return new OkObjectResult(queryBit);
}


public class InputPivotEntry {
    public string PivotName;
    public bool AggregateByPivot;
    public string ScopeValue;
}
