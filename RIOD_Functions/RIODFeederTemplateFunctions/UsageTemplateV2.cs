// Original function app: RIODFeederTemplateFunctions

#r "Newtonsoft.Json"
#r "System.Net.Http"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System.Linq;
using System.Data;
using System.Net.Http.Headers;

public class InputUsageConfig
{
    private string _studyConfigID;
    // special case: convert StudyConfigID to string if not a string
    public string StudyConfigID { get => _studyConfigID; set => _studyConfigID = "" + value; }
    public string PivotName { get; set; }
    // Census to Usage column name mapping
    public string TargetPivotName { get; set; }
    public bool AggregateBy { get; set; }
    public string PivotScopeOperator { get; set; }
    public bool IsUsagePivot {get; set; }
    public string PivotOperator { get; set; }
    public string PivotScopeValue { get; set; }
    public string PivotKey { get; set; }
    public string PivotSourceViewPath  {get; set; }
    public int PivotScopeID {get; set; }
    public string UsageJoinKeyExpressionCols {get;set;}
}

public class OutputJSON
{
    public string StudyList { get; set; }
    public string ViewSourcePath { get; set; }
    public HashSet<string> AggregateBy { get; set; }
    public HashSet<string> UsagePivotColumns { get; set; }
    public string FilterExpression { get; set; }
    public string UsageJoinKeyExpressionCols {get; set;}

    // default constructor
    public OutputJSON()
    {
        this.AggregateBy = new HashSet<string> { };
        this.UsagePivotColumns = new HashSet<string> { };
    }
}

/**
call Azure Function with a list of Pivot Scopes to generate a filter expression
*/
static async Task<string> getFilterExpression(List<InputUsageConfig> list)
{
    // edge case
    string ans = "";

    // make an http call to azure function
    HttpClient client = new HttpClient();
    String funcURL = System.Environment.GetEnvironmentVariable("FilterExpressionFunctionURL");
    client.BaseAddress = new Uri(funcURL);

    try
    {
        HttpResponseMessage respone = await client.PostAsJsonAsync("", value: list); 
        ans = respone.Content.ReadAsStringAsync().Result;
    }
    catch(Exception e)
    {
        Console.WriteLine(e.Message);
    }

    return ans;

}

// Gets all aggregateBy columns
static HashSet<String> GetAggregateByColsString(InputUsageConfig[] input)
{
    HashSet<String> aggsSet = new HashSet<String>();
    foreach(InputUsageConfig ele in input)
    {
        if(ele.AggregateBy == true && ele.TargetPivotName!=null)
        {
            aggsSet.Add(ele.TargetPivotName);
        }
    }

    return aggsSet;
}

static HashSet<String> GetPrimaryColumns(InputUsageConfig[] input)
{
    HashSet<String> primarySet = new HashSet<String>();
    foreach(InputUsageConfig ele in input)
    {
        if(ele.IsUsagePivot == true)
        {
            primarySet.Add(ele.PivotName);
        }
    }

    return primarySet;
}

static string combine(InputUsageConfig[] input)
{
    // combine by study config id first
    Dictionary<String,OutputJSON> perStudyConfigIDDict = new Dictionary<String,OutputJSON>();
    Dictionary<String,List<InputUsageConfig>> filterExpDict = new Dictionary<String,List<InputUsageConfig>>();

    foreach(InputUsageConfig ele in input)
    {
        var key = ele.StudyConfigID;

        if(!perStudyConfigIDDict.ContainsKey(key))
        perStudyConfigIDDict.Add(key,new OutputJSON());
        
        if(!String.IsNullOrEmpty(ele.PivotOperator) && !String.IsNullOrEmpty(ele.PivotScopeValue))
        {
            if(!filterExpDict.ContainsKey(key))
                filterExpDict.Add(key,new List<InputUsageConfig>());

            filterExpDict[key].Add(ele);
        }

        OutputJSON obj = perStudyConfigIDDict[key];

        obj.StudyList = key;
        obj.UsageJoinKeyExpressionCols = ele.UsageJoinKeyExpressionCols;

        if(ele.AggregateBy == true)
        obj.AggregateBy.Add(ele.TargetPivotName);

        if(ele.IsUsagePivot == true)
        {        
            obj.UsagePivotColumns.Add(ele.PivotName);
        }
    }

    // Get Filter expression
    foreach(var entry in filterExpDict)
    {
        String id = entry.Key;
        String filterexp = getFilterExpression(entry.Value).Result;
        perStudyConfigIDDict[id].FilterExpression = filterexp;
    }

    // combine studies with same aggregate by
    Dictionary<String,OutputJSON> reducedInputsDict = new Dictionary<String,OutputJSON>();

        foreach (var entry in perStudyConfigIDDict)
        {
            String studyid = entry.Key;
            OutputJSON ele = entry.Value;
            
            String aggByStr = string.Join(",",ele.AggregateBy);

            if(!reducedInputsDict.ContainsKey(aggByStr))
                reducedInputsDict.Add(aggByStr,new OutputJSON());

            OutputJSON obj = reducedInputsDict[aggByStr];
            if(String.IsNullOrEmpty(obj.StudyList))
                obj.StudyList = ele.StudyList;
            else 
                obj.StudyList = obj.StudyList + "," + ele.StudyList;

            obj.UsagePivotColumns.UnionWith(ele.UsagePivotColumns);
            obj.AggregateBy.UnionWith(ele.AggregateBy);

            if(String.IsNullOrEmpty(obj.FilterExpression))
            obj.FilterExpression = ele.FilterExpression;
            else if(!String.IsNullOrEmpty(ele.FilterExpression) && !String.IsNullOrEmpty(obj.FilterExpression))
            obj.FilterExpression = obj.FilterExpression + " OR " + ele.FilterExpression;

            obj.UsageJoinKeyExpressionCols = ele.UsageJoinKeyExpressionCols;
        }
    

    List<OutputJSON> jsons = new List<OutputJSON>();

    foreach(var entry in reducedInputsDict)
    {
        jsons.Add(entry.Value);
    }

    // print final list for output
    var json = GetPrettyJSON(jsons);
    
    return json;
}

static String GetPrettyJSON(List<OutputJSON> inputs)
{
    String json = "[";
    int ctr = 0;

        foreach(OutputJSON obj in inputs)
        {
            obj.StudyList = obj.StudyList.Replace("\"","\\\"");
            json = json + "{\"StudyList\":\"[{"+ "\\\"" + String.Join("\\\" , \\\"", obj.StudyList)+ "\\\"" + "}]\",\"AggregateBy\":\"[{" + "\\\"" + String.Join("\\\" , \\\"",obj.AggregateBy)+ "\\\"" +"}]\",\"UsageJoinKeyExpressionCols\":\"[{" + "\\\"" + String.Join("\\\" , \\\"",obj.UsageJoinKeyExpressionCols.Split(";"))+ "\\\"" +"}]\",\"UsagePivotColumns\":\"[{"+ "\\\"" +String.Join("\\\" , \\\"",obj.UsagePivotColumns)+ "\\\"" +"}]\",\"FilterExpression\":\"";
            json = json+ obj.FilterExpression + "\"}";

            if(ctr != (inputs.Count - 1))
            {
                json += ",";
            }

            ctr++;

        }

        json += "]";

        return json;
}

public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    var settings = new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore };
    InputUsageConfig[] pcArray = JsonConvert.DeserializeObject<InputUsageConfig[]>(requestBody,settings);
    string ans = "";
    if (pcArray != null)
    {
        ans = combine(pcArray);
        log.LogInformation(ans);
    }

    log.LogInformation("<---END Azure Function--->");
    return new OkObjectResult($"{ans}");
}