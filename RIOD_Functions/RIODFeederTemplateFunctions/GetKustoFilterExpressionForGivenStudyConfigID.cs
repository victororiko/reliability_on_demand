// Original function app: RIODFeederTemplateFunctions

#r "Newtonsoft.Json"

using System.Text;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http.Features;
using System.Text.RegularExpressions;

/**
Generate a filter expression that can be utilized in current WFs such as 
 Rel.UnifiedSchema.Prep.Windows.Desktop.Development.T4 (https://xflow.microsoft.com/Workflows/Details/Rel.UnifiedSchema.Prep.Windows.Desktop.Development.T4)
 code behind - 
 https://microsoft.visualstudio.com/OS.Fun/_search?action=contents&text=%20Rel.UnifiedSchema.Prep.Windows.Desktop.Development.T4&type=code&lp=code-Project&filters=ProjectFilters%7BOS.Fun%7DRepositoryFilters%7Breliability.processing.unifiedschema%7D&pageSize=25&includeFacets=false&result=DefaultCollection/OS.Fun/reliability.processing.unifiedschema/GBmaster//reliability.processing.unifiedschema.failurecurve/Workflows/UnifiedSchema.Prep.Windows.Desktop.Development.wfdef
 look for Activity CensusDevices
*/
public class PivotConfig
{
    public string UIInputDataType { get; set; } 
    private string _pivotKey;

    public string PivotKey
    {
        get => _pivotKey;
        set => _pivotKey = cleanUp(value);
    }

    public string RelationalOperator { get; set; } // default = ''
                                                    // RELPivotScope specific properties
    public string PivotOperator { get; set; }
    public string PivotScopeValue { get; set; }

    // String representation
    public override string ToString()
    {
        StringBuilder sb = new StringBuilder();
        sb.Append($"{PivotKey} {PivotOperator} ");
        if (PivotOperator == "IN")
            sb.Append($"({PivotScopeValue}) ");
        else
            sb.Append($"{PivotScopeValue} ");

        if (!String.IsNullOrEmpty(RelationalOperator))
            sb.Append($"{RelationalOperator} ");

        return sb.ToString();
    }

    // eg: DeviceCensusConsolidated.ss_AADTenantCountryCode --> AADTenantCountryCode
    string cleanUp(string PivotKey)
    {
        if (PivotKey.Contains("_"))
        {
            int pivotNameStartIdx = PivotKey.IndexOf("_");
            if (pivotNameStartIdx < PivotKey.Length)
                PivotKey = PivotKey.Substring(pivotNameStartIdx + 1);
        }
        return PivotKey;
    }
}

static void printList(List<string> list, ILogger log)
{
    string printedList = String.Join(" ", list);
    log.LogDebug(printedList);
}

static string GetFinalExpression(PivotConfig[] inputConfigArray, ILogger log)
{
    if (inputConfigArray == null || inputConfigArray.Length == 0) return "";

    Dictionary<string, List<PivotConfig>> map = new Dictionary<string, List<PivotConfig>>();

    StringBuilder sb = new StringBuilder("");

    // by default assuming we have an array of minimum 1 element -> set it to be lastKey
    string lastKey = inputConfigArray[0].PivotKey;
    PivotConfig lastConfig = inputConfigArray[0];

    log.LogDebug("----- Looping through input -----");
    // loop through each config grouping them by PivotKey
    foreach (PivotConfig pc in inputConfigArray)
    {
        log.LogDebug($"current => {pc}");
        // track the last config if you hit a non-relational operator
        if (String.IsNullOrEmpty(pc.RelationalOperator))
        {
            lastConfig = pc;
            lastKey = pc.PivotKey;
            log.LogDebug($"last = {lastConfig}");
        }

        if (map.ContainsKey(pc.PivotKey))
        {
            var list = map[pc.PivotKey];
            list.Add(pc);
            list.Sort((x, y) => y.RelationalOperator.CompareTo(x.RelationalOperator));
        }
        else
        {
            map.Add(pc.PivotKey, new List<PivotConfig> { pc });
        }
    }

    // use a list of strings to generate entire expression
    log.LogDebug("----- Generating Filter Expression String -----");
    List<string> ansList = new List<string>();
    foreach (var key in map.Keys)
    {
        //if (key.Equals(lastKey))
        //{
            List<PivotConfig> configs = map[key];
            foreach (var config in configs)
            {
                if(key.Equals(lastKey) && string.IsNullOrEmpty(config.RelationalOperator))
                    continue;

                if(String.Equals(config.PivotScopeValue,"\"\"") && String.Equals(config.RelationalOperator,"!="))
                {
                    ansList.Add("isnotempty("+config.PivotKey+")");
                    if (string.IsNullOrEmpty(config.RelationalOperator))
                    ansList.Add("or");
                    else
                    ansList.Add(config.RelationalOperator.ToLower());
                    printList(ansList, log);
                    continue;
                }

                if(String.Equals(config.UIInputDataType,"number"))    
                    ansList.Add("tolong("+config.PivotKey+")");
                else
                    ansList.Add(config.PivotKey);

                ansList.Add(String.Equals(config.PivotOperator,"IN")? "in":config.PivotOperator);
                
                ansList.Add(config.PivotScopeValue);

                if (string.IsNullOrEmpty(config.RelationalOperator))
                    ansList.Add("or");
                else
                    ansList.Add(config.RelationalOperator.ToLower());

                printList(ansList, log);
            }
        //}
    }
    
    // add last pivot scope

        if(String.Equals(lastConfig.PivotScopeValue,"\"\"") && String.Equals(lastConfig.RelationalOperator,"!="))
        {
                    ansList.Add("isnotempty("+lastConfig.PivotKey+")");
                    if (string.IsNullOrEmpty(lastConfig.RelationalOperator))
                    ansList.Add("or");
                    else
                    ansList.Add(lastConfig.RelationalOperator.ToLower());
                    printList(ansList, log);
        }
        else
        {
        if(String.Equals(lastConfig.UIInputDataType,"number"))    
            ansList.Add("tolong("+lastConfig.PivotKey+")");
        else
            ansList.Add(lastConfig.PivotKey);
        ansList.Add(String.Equals(lastConfig.PivotOperator,"IN")? "in":lastConfig.PivotOperator);
        
        ansList.Add(lastConfig.PivotScopeValue);
        
        printList(ansList, log);
        }

    // remove last relational operator
    string ans = string.Join(" ", ansList);
    //return ansList.Count().ToString();
    return ans;
}


// check if the value matches with the Number datatype
public static bool checkValueWithNumberDatatype(string value)
{
    int numVal;
    bool isNumeric = int.TryParse(value, out numVal);
    return isNumeric;
}

// Used for testing locally - do not remove
public static string Test(string json, ILogger log)
{
    // parse pivot config that is passed in
    PivotConfig[] inputConfigArray = JsonConvert.DeserializeObject<PivotConfig[]>(json);
    string ans = GetFinalExpression(inputConfigArray, log);
    log.LogInformation(ans);
    ans = Regex.Unescape(ans);
    ans = ans.Trim();
    return ans;
}

// Entry point
public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    log.LogInformation("----- Begin Azure Function -----");
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    // parse pivot config that is passed in
    PivotConfig[] inputConfigArray = JsonConvert.DeserializeObject<PivotConfig[]>(requestBody);

    // Act
    string ans = GetFinalExpression(inputConfigArray, log);

    // Clean up resultant string
    ans = Regex.Unescape(ans);
    ans = ans.Trim();
    log.LogInformation(ans);

    log.LogInformation("----- End Azure Function -----");
    // Return
    return new OkObjectResult(ans);
}