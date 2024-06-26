// Original function app: RIODUnifiedConfigFunction

#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System.Security.Cryptography; 
using System.Text;

public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string uidString = req.Query["UniqueString"];

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    uidString = uidString ?? data?.uidString;
    Guid uidHashGuid = new Guid(MD5.Create().ComputeHash(Encoding.Default.GetBytes(uidString.ToLowerInvariant())));

    string responseMessage = uidHashGuid.ToString();

    return new OkObjectResult(responseMessage);
}

