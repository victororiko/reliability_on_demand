// Original function app: RIODStandardizeStudyPivots

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

    string hashString = await new StreamReader(req.Body).ReadToEndAsync();
    Guid result;
    using (MD5 md5 = MD5.Create())
    {
        byte[] hash = md5.ComputeHash(Encoding.Default.GetBytes(hashString));
        result = new Guid(hash);
    }
    string responseMessage = result.ToString();

    return new OkObjectResult(responseMessage);
}
