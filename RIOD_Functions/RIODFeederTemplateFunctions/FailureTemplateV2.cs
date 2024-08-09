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

public class InputFailureConfig
{
    private string _studyConfigID;
    // special case: convert StudyConfigID to string if not a string
    public string StudyConfigID { get => _studyConfigID; set => _studyConfigID = "" + value; }
    public string PivotExpression { get; set; }
    public string PivotSourceViewPath { get; set; }
    public string UIDataType { get; set; }
    public string PivotSourceSubType { get; set; }
    public string FailureEventNameList { get; set; }
    public string PivotSourceColumnName { get; set; }
    public string RelationalOperator { get; set; }
    public bool IsSelectColumn {get; set; }
    public bool IsApportionColumn {get; set; }
    public bool IsApportionJoinColumn {get; set; }
    public bool IsKeyColumn {get; set; }    
    public string PivotOperator { get; set; }
    public string PivotScopeValue { get; set; }
    public string PivotKey { get; set; }
    public int PivotScopeID {get; set; }
    public string FailureJoinKeyExpressionCols {get; set;}
    public bool FailureFeederIgnored {get; set;}
    public string AuxiliaryClause {get; set;}
    public string ImportantProcessClause {get; set;}
    public string Scenario1Clause {get; set;}
    public string VerticalName {get;set;}
}

public class OutputJSON
{
    public string QueryId { get; set; }
    public string StudyIdList { get; set; }
    public string SnapShotType { get; set; }
    public string SnapShotSource { get; set; }
    public string ViewSourcePath { get; set; }
    public string LookBackPeriodInHours { get; set; }
    public HashSet<string> SelectColumns { get; set; }
    public HashSet<string> ApportionJoinColumns { get; set; }
    public HashSet<string> ApportionColumns { get; set; }
    public HashSet<string> KeyColumns { get; set; }
    public HashSet<string> WatsonEventList { get; set; }
    public HashSet<string> Measures { get; set; }
    public string FilterExpression { get; set; }
    public string FailureJoinKeyExpressionCols {get; set;}
    public string AuxiliaryClause {get; set;}
    public string ImportantProcessClause {get; set;}
    public HashSet<string> ScenarioClauses {get; set;}
    public string[] Scenarios {get;set;}

    // default constructor
    public OutputJSON()
    {
        this.SelectColumns = new HashSet<string> { };
        this.ApportionJoinColumns = new HashSet<string> { };
        this.ApportionColumns = new HashSet<string> { };
        this.KeyColumns = new HashSet<string> { };
        this.WatsonEventList = new HashSet<string> { };
        this.Measures = new HashSet<string> { };
        this.ScenarioClauses = new HashSet<string> { };
        this.Scenarios = new string[3];
    }
}

/**
call Azure Function with a list of Pivot Scopes to generate a filter expression
*/
static async Task<string> getFilterExpression(List<InputFailureConfig> list)
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

static void addHardCodedAttr(OutputJSON obj,String sourcetype)
{
    obj.SnapShotType = "Threshold";
    obj.LookBackPeriodInHours = "336";
    
    if(string.Equals(sourcetype,"KernelMode"))
    {
        obj.SnapShotSource = "KernelMode";
        obj.Measures.Add("AttributedHits");

        // Adding default verticals
        obj.WatsonEventList.Add("bluescreen");
        obj.WatsonEventList.Add("livekernelevent");
    }
    else
    {
        obj.SnapShotSource = "";
        obj.Measures.Add("ApportionedHits");
        obj.Measures.Add("ApportionedMachineCount");

        // Adding default verticals
        obj.WatsonEventList.Add("{appcrash}");
        obj.WatsonEventList.Add("{moappcrash}");
        obj.WatsonEventList.Add("{apphang}");
        obj.WatsonEventList.Add("{moapphang}");
        obj.WatsonEventList.Add("criticalprocessfault2");
    }
}

static string combine(InputFailureConfig[] input)
{
    // combine by study config id first
    Dictionary<String,Dictionary<String,OutputJSON>> perStudyConfigIDDict = new Dictionary<String, Dictionary<String,OutputJSON>>();
    Dictionary<String,Dictionary<String,List<InputFailureConfig>>> filterExpDict = new Dictionary<String, Dictionary<String,List<InputFailureConfig>>>();
    Dictionary<String,Dictionary<String,HashSet<String>>> uniquefilterExpDict = new Dictionary<String, Dictionary<String,HashSet<String>>>();
    Dictionary<String,HashSet<String>> uniqScenarios = new Dictionary<String,HashSet<String>>();
    Dictionary<String,string[]> uniqScenariosArr = new Dictionary<String,string[]>();

    foreach(InputFailureConfig ele in input)
    {
        String viewpath = ele.PivotSourceViewPath;

        if(ele.FailureFeederIgnored == true)
        {
            continue;
        }

        if(!perStudyConfigIDDict.ContainsKey(viewpath))
        {
            Dictionary<String,OutputJSON> dict = new Dictionary<String,OutputJSON>();
            perStudyConfigIDDict.Add(viewpath,dict);
        }

        var studyId = ele.StudyConfigID;
        var sourcetype = ele.PivotSourceSubType;
        var key = studyId +";"+sourcetype+";"+ele.AuxiliaryClause;
        var uniqFilterKey = studyId+";"+sourcetype;
        var scenariokey = studyId +";"+sourcetype;

        if(!perStudyConfigIDDict[viewpath].ContainsKey(key))
        perStudyConfigIDDict[viewpath].Add(key,new OutputJSON());

        if(!String.IsNullOrEmpty(ele.PivotOperator) && !String.IsNullOrEmpty(ele.PivotScopeValue))
        {
            if(!filterExpDict.ContainsKey(viewpath))
            {
                Dictionary<String,List<InputFailureConfig>> dict = new Dictionary<String,List<InputFailureConfig>>();
                filterExpDict.Add(viewpath,dict);
                Dictionary<String,HashSet<String>> uniqdict = new Dictionary<String,HashSet<String>>();
                uniquefilterExpDict.Add(viewpath,uniqdict);
            }

            if(!filterExpDict[viewpath].ContainsKey(key))
            {
                filterExpDict[viewpath].Add(key,new List<InputFailureConfig>());
            }

            if(!uniquefilterExpDict[viewpath].ContainsKey(uniqFilterKey))
            {
                uniquefilterExpDict[viewpath].Add(uniqFilterKey,new HashSet<String>());
            }

            // checking filter expression
            String st = ele.PivotKey.Trim() + ";" + ele.PivotOperator.Trim() + ";" + ele.PivotScopeValue.Trim()+ ";"+ ele.RelationalOperator.Trim();

            if(!String.IsNullOrEmpty(ele.PivotScopeValue) && !uniquefilterExpDict[viewpath][uniqFilterKey].Contains(st))
            {
                filterExpDict[viewpath][key].Add(ele);
                uniquefilterExpDict[viewpath][uniqFilterKey].Add(st);
            }
        }

        OutputJSON obj = perStudyConfigIDDict[viewpath][key];

        obj.StudyIdList = studyId;
        obj.ViewSourcePath = viewpath;
        obj.FailureJoinKeyExpressionCols = ele.FailureJoinKeyExpressionCols;
        obj.AuxiliaryClause = ele.AuxiliaryClause;

        if(!String.IsNullOrEmpty(ele.ImportantProcessClause))
        obj.ImportantProcessClause = ele.ImportantProcessClause;

        if(!uniqScenarios.ContainsKey(scenariokey))
        {
            uniqScenarios.Add(scenariokey,new HashSet<string>());
            uniqScenariosArr.Add(scenariokey,new string[3]);
        }
        else
        {
            if(uniqScenarios[scenariokey].Add(ele.Scenario1Clause) && !String.IsNullOrEmpty(ele.Scenario1Clause))
            {
                var verticalname = ele.VerticalName;
                string[] arr = verticalname.Split("_");
                char[] strs = arr[arr.Length-1].ToCharArray();
                int count = Int32.Parse(strs[strs.Length-1]+"");
                uniqScenariosArr[scenariokey][count-1] = ele.Scenario1Clause;
            }
        }

        if(ele.IsSelectColumn == true)
        obj.SelectColumns.Add(String.IsNullOrEmpty(ele.PivotExpression)?ele.PivotSourceColumnName: ele.PivotExpression);

        if(ele.IsApportionColumn == true)
        obj.ApportionColumns.Add(String.IsNullOrEmpty(ele.PivotExpression)?ele.PivotSourceColumnName: ele.PivotExpression);

        if(ele.IsKeyColumn == true)
        obj.KeyColumns.Add(String.IsNullOrEmpty(ele.PivotExpression)?ele.PivotSourceColumnName: ele.PivotExpression);

        if(ele.IsApportionJoinColumn == true)
        obj.ApportionJoinColumns.Add(String.IsNullOrEmpty(ele.PivotExpression)?ele.PivotSourceColumnName: ele.PivotExpression);

        if(obj.WatsonEventList == null)
        obj.WatsonEventList = new HashSet<string>(ele.FailureEventNameList.Split(',').Select(s => s));
        else
        {
            foreach(String vertical in ele.FailureEventNameList.Split(','))
            {
                obj.WatsonEventList.Add(vertical);
            }
        }

        addHardCodedAttr(obj,sourcetype);
    }

    // Get Filter expression
    String filterexp = "";
    foreach(var entry in filterExpDict)
    {
        String viewpath = entry.Key;
        foreach (var item in entry.Value)
        {
            filterexp = getFilterExpression(item.Value).Result;
            perStudyConfigIDDict[viewpath][item.Key].FilterExpression = filterexp;
        }
    }

    // Adding scenarios array to per study dict
    foreach(var entry in perStudyConfigIDDict)
    {
        String viewpath = entry.Key;
        foreach (var item in entry.Value)
        {
            String key = item.Key;
            String studyid = key.Split(';')[0];
            String sourcetype = key.Split(';')[1];
            OutputJSON ele = item.Value;
            var scenariokey = studyid +";"+sourcetype;
            ele.Scenarios = uniqScenariosArr[scenariokey];
        }
    }


    // combine studies with same aggregate by
    Dictionary<String,Dictionary<String,OutputJSON>> reducedInputsDict = new Dictionary<String, Dictionary<String,OutputJSON>>();

    foreach(var entry in perStudyConfigIDDict)
    {
        String viewpath = entry.Key;
        foreach (var item in entry.Value)
        {
            String key = item.Key;
            String studyid = key.Split(';')[0];
            String sourcetype = key.Split(';')[1];
            OutputJSON ele = item.Value;

            if(!reducedInputsDict.ContainsKey(viewpath))
            {
                Dictionary<String,OutputJSON> dict = new Dictionary<String,OutputJSON>();
                reducedInputsDict.Add(viewpath,dict);
            }

            
            // combine based on the sourcetype and the Failure join key expression cols
            String joined = sourcetype+";"+ele.AuxiliaryClause+";"+ele.FailureJoinKeyExpressionCols;

            if(!reducedInputsDict[viewpath].ContainsKey(joined))
                reducedInputsDict[viewpath].Add(joined,new OutputJSON());

            OutputJSON obj = reducedInputsDict[viewpath][joined];

            obj.SnapShotType = ele.SnapShotType;
            obj.LookBackPeriodInHours = ele.LookBackPeriodInHours;
            obj.ApportionColumns = ele.ApportionColumns;
            obj.ApportionJoinColumns = ele.ApportionJoinColumns;
            obj.KeyColumns = ele.KeyColumns;
            obj.Measures = ele.Measures;
            obj.AuxiliaryClause = ele.AuxiliaryClause;

            if(!String.IsNullOrEmpty(ele.ImportantProcessClause))
            obj.ImportantProcessClause = ele.ImportantProcessClause;

            if(String.IsNullOrEmpty(obj.StudyIdList))
                obj.StudyIdList = ele.StudyIdList;
            else
                obj.StudyIdList = obj.StudyIdList + "," + ele.StudyIdList;
            obj.ViewSourcePath = viewpath;

            obj.SelectColumns.UnionWith(ele.SelectColumns);
            obj.WatsonEventList.UnionWith(ele.WatsonEventList);
            
            for(int scenariocount = 0; scenariocount < obj.Scenarios.Length; scenariocount++)
            {
                if(String.IsNullOrEmpty(obj.Scenarios[scenariocount]) && !String.IsNullOrEmpty(ele.Scenarios[scenariocount]))
                {
                    obj.Scenarios[scenariocount] = ele.Scenarios[scenariocount];
                }
            }

            if(String.IsNullOrEmpty(obj.FilterExpression) && !String.IsNullOrEmpty(ele.FilterExpression))
            {
                // Add default filter exp
                if(string.Equals(ele.SnapShotSource,"KernelMode"))
                {
                    obj.FilterExpression = "((!(bool)(ctrlIsTestMachine ?? false) AND (int)(ctrlTestScenarioNumber ?? 0) == 0)) AND";
                }
                else
                {
                    obj.FilterExpression = "((!(bool)(ctrlIsTestMachine??false) AND ((DeviceClass ?? DeviceFamily) ?? string.Empty).ToLowerInvariant()== \\\\\\\"windows.desktop\\\\\\\" AND (int)(ctrlTestScenarioNumber ?? 0) == 0)) AND ";
                }

                obj.FilterExpression = obj.FilterExpression +" (" +ele.FilterExpression+")";
            }
            else if(!String.IsNullOrEmpty(ele.FilterExpression) && !String.IsNullOrEmpty(obj.FilterExpression) && !obj.FilterExpression.Contains(ele.FilterExpression))
            {
                obj.FilterExpression = "("+obj.FilterExpression + ") OR (" + ele.FilterExpression+")";
            }

            obj.FailureJoinKeyExpressionCols = ele.FailureJoinKeyExpressionCols;
            obj.SnapShotSource = ele.SnapShotSource;
        }
    }

    List<OutputJSON> jsons = new List<OutputJSON>();

    foreach(var entry in reducedInputsDict)
    {
        foreach(var ele in entry.Value)
        {
            jsons.Add(ele.Value);
        }
    }

    // print final list for output
    var json = GetPrettyJSON(jsons);
    return json;
}

static String GetPrettyJSON(List<OutputJSON> inputs)
{
    String json = "[";
    int ctr = 0;
    int queryid = 1;

        foreach(OutputJSON obj in inputs)
        {
            json = json + "{\"QueryId\":\""+ queryid + "\",\"StudyIdList\":\"[{"+ "\\\"" 
            + String.Join("\\\" , \\\"", obj.StudyIdList)+ "\\\"" + "}]\",\"SnapShotSource\":\""
            +obj.SnapShotSource + "\",\"SnapShotType\":\""+obj.SnapShotType 
            + "\",\"ViewSourcePath\":\""+obj.ViewSourcePath+ "\",\"LookBackPeriodInHours\":\""
            +obj.LookBackPeriodInHours
            + "\",\"FailureJoinKeyExpressionCols\":\"[{" + "\\\"" + obj.FailureJoinKeyExpressionCols+ "\\\"" 
            +"}]\",\"SelectColumns\":"+ (obj.SelectColumns.Count == 0 ? ( "\"\"") : ("\"[{" + "\\\"" + String.Join("\\\" , \\\"",obj.SelectColumns)+ "\\\"" +"}]\""))
            +",\"ApportionJoinColumns\":"+ (obj.ApportionJoinColumns.Count == 0 ? ( "\"\"") : ("\"[{"+ "\\\"" +String.Join("\\\" , \\\"",obj.ApportionJoinColumns)+ "\\\"" +"}]\""))
            +",\"ApportionColumns\":"+ (obj.ApportionColumns.Count == 0 ? ( "\"\"") : ("\"[{"+ "\\\"" +String.Join("\\\",\\\"",obj.ApportionColumns)+"\\\"" +"}]\""))
            +",\"KeyColumns\":"+ (obj.KeyColumns.Count == 0 ? ( "\"\"") : ("\"[{"+ "\\\"" +String.Join("\\\",\\\"",obj.KeyColumns)+"\\\"" +"}]\""))
            +",\"WatsonEventList\":"+"\"[{"+"\\\"" + String.Join("\\\",\\\"",obj.WatsonEventList)+"\\\"" +"}]\""
            +",\"Measures\":\"[{"+"\\\"" + String.Join("\\\",\\\"",obj.Measures)+"\\\"" +"}]\",\"FilterExpression\":";

            json = json+ (!String.IsNullOrEmpty(obj.FilterExpression)?"\"("+obj.FilterExpression+")\"": "\"\"")
            +",\"Auxiliary_Clause\":"+(!String.IsNullOrEmpty(obj.AuxiliaryClause)?"\"("+obj.AuxiliaryClause+")\"": "\"\"")
            +",\"ImportantProcess_Clause\":"+(!String.IsNullOrEmpty(obj.ImportantProcessClause)?"\"("+obj.ImportantProcessClause+")\"": "\"\"")
            +",\"Scenario_1_Clause\":"+ (!String.IsNullOrEmpty(obj.Scenarios[0])?"\"("+obj.Scenarios[0]+")\"": "\"\"")
            +",\"Scenario_2_Clause\":"+ (!String.IsNullOrEmpty(obj.Scenarios[1])?"\"("+obj.Scenarios[1]+")\"": "\"\"")
            +",\"Scenario_3_Clause\":"+ (!String.IsNullOrEmpty(obj.Scenarios[2])?"\"("+obj.Scenarios[2]+")\"": "\"\"")
            +"}";

            if(ctr != (inputs.Count - 1))
            {
                json += ",";
            }

            ctr++;
            queryid++;
        }

        json += "]";

        return json;
}

public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    var settings = new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore };
    InputFailureConfig[] pcArray = JsonConvert.DeserializeObject<InputFailureConfig[]>(requestBody,settings);
    string ans = "";
    if (pcArray != null)
    {
        ans = combine(pcArray);
        log.LogInformation(ans);
    }

    log.LogInformation("<---END Azure Function--->");
    return new OkObjectResult($"{ans}");
}