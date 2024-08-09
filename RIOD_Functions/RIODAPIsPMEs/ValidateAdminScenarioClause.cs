// Original function app: RIODAPIsPMEs

#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

class FilterExp{
    public string clause { get; set; }
}

static string GetFormattedFilterExp(string exp)
{
    string replacedSlash = exp.Replace("\\\\\\\"","\"");
    string ans = replacedSlash.Replace("\"","\\\\\\\"");
    return ans;
}

public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();


    FilterExp expObj = JsonConvert.DeserializeObject<FilterExp>(requestBody);
    
    string formattedString = GetFormattedFilterExp(expObj.clause);

    return new OkObjectResult(formattedString);
}