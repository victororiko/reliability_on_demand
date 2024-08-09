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
using System.Text.RegularExpressions;

public class InputPivotConfig
        {
            public string Source { get; set; }
            public string SourcePath { get; set; }
            public string ViewSourcePath { get; set; }
            private string _studyConfigID;
            // special case: convert StudyConfigID to string if not a string
            public string StudyConfigID { get => _studyConfigID; set => _studyConfigID = "" + value; }
            public string SelectColumn { get; set; }

            // filter expression related fields
            public string PivotKey { get; set; }
            public string PivotOperator { get; set; }
            public string PivotScopeValue { get; set; }
            public string RelationalOperator { get; set; }
            public Boolean AggregateBy { get; set; }
            public string PopulationJoinKeyExpressionCols { get; set; }

            public override string ToString()
            {
                string prettyStr = $"{Source} {SourcePath} {ViewSourcePath}";
                return prettyStr;
            }
        }

        public class OutputJSON
        {
            public string Source { get; set; }
            public string SourcePath { get; set; }
            public string ViewSourcePath { get; set; }
            public HashSet<string> StudyConfigIDList { get; set; }
            public HashSet<string> SelectColumnSet { get; set; }
            public string SelectColumnList { get; set; }
            public HashSet<string> AggregateByColumnSet { get; set; }
            public string AggregateByColumnList { get; set; }
            public string PopulationJoinKeyExpressionCols { get; set; }
            public string FilterExpression { get; set; }

            // default constructor
            public OutputJSON()
            {
                this.StudyConfigIDList = new HashSet<string> { };
                this.SelectColumnSet = new HashSet<string> { };
                this.AggregateByColumnSet = new HashSet<string> { };
            }

            public override string ToString()
            {
                return base.ToString();
            }
        }
        /**
call Azure Function with a list of Pivot Scopes to generate a filter expression
*/
        static async Task<string> getFilterExpression(List<InputPivotConfig> list, ILogger log)
        {
            // edge case
            string ans = "";

            // make an http call to azure function
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("https://riodapis.azurewebsites.net/api/ValidateFilterExpression?code=USE MANAGED IDENTITY");

            try
            {
                HttpResponseMessage respone = await client.PostAsJsonAsync("", value: list);
                ans = respone.Content.ReadAsStringAsync().Result;
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
            }

            return ans;

        }

        static string combine(InputPivotConfig[] input, ILogger log)
        {
            // create a dictionary for output json -- <source, content>
            Dictionary<string, OutputJSON> dict = new Dictionary<string, OutputJSON>();
            // keep track of all input configs per source
            Dictionary<string, List<InputPivotConfig>> filterExpDict = new Dictionary<string, List<InputPivotConfig>>();

            foreach (InputPivotConfig element in input)
            {
                // extract source string - this will be the key we use in our dict
                string sourceStr = element.Source;

                // populating dict
                if (dict.ContainsKey(sourceStr))
                {
                    var temp = dict.GetValueOrDefault(sourceStr);
                    if (temp != null)
                    {
                        temp.StudyConfigIDList.Add(element.StudyConfigID);
                        temp.SelectColumnSet.Add(element.SelectColumn);
                        if (element.AggregateBy)
                            temp.AggregateByColumnSet.Add(element.SelectColumn);
                    }
                }
                else
                {
                    OutputJSON o = new OutputJSON();
                    o.Source = element.Source;
                    o.ViewSourcePath = element.ViewSourcePath;
                    o.SourcePath = element.SourcePath;
                    o.StudyConfigIDList.Add(element.StudyConfigID); // add to HashSet i.e. unique values only
                    o.SelectColumnSet.Add(element.SelectColumn); // add to HashSet i.e. unique values only
                    if(element.AggregateBy)
                        o.AggregateByColumnSet.Add(element.SelectColumn);
                    o.PopulationJoinKeyExpressionCols = element.PopulationJoinKeyExpressionCols; // pass through string to output
                    dict.Add(sourceStr, o);
                }

                if(!String.IsNullOrEmpty(element.PivotOperator) && !String.IsNullOrEmpty(element.PivotScopeValue))
                {
                    // add to filterExp list as well
                    if (filterExpDict.ContainsKey(sourceStr))
                        filterExpDict[sourceStr].Add(element);
                    else
                    {
                        List<InputPivotConfig> starterList = new List<InputPivotConfig> { element };
                        filterExpDict.Add(sourceStr, starterList);
                    }
                }

            }// end aggregating 

            // populate SelectColumnList as a comma separated string
            foreach(var ele in dict.Values)
            {
                ele.SelectColumnList = string.Join(",",ele.SelectColumnSet);
                ele.AggregateByColumnList = string.Join(",",ele.AggregateByColumnSet);
            }

            // Add Filter Expressions from backend
            foreach (var item in filterExpDict)
            {
                List<InputPivotConfig> configsList = item.Value;
                string finalExpression = getFilterExpression(configsList, log).Result;

                if(!String.IsNullOrEmpty(finalExpression))
                dict[item.Key].FilterExpression = finalExpression;
            }

            // print final list
            var listToSerialize = dict.Values.ToArray<OutputJSON>();
            var json = JsonConvert.SerializeObject(listToSerialize);
            return json;
        }

        // Used for testing locally - do not remove
        public static string Test(string json, ILogger log)
        {
            InputPivotConfig[] pcArray = JsonConvert.DeserializeObject<InputPivotConfig[]>(json);
            string ans = "";
            if (pcArray != null)
            {
                ans = combine(pcArray,log);
                log.LogInformation(ans);
            }
            return ans;
        }

        public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
        {
            log.LogInformation("<---START Azure Function--->");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            InputPivotConfig[] pcArray = JsonConvert.DeserializeObject<InputPivotConfig[]>(requestBody);
            string ans = "";
            if (pcArray != null)
            {
                ans = combine(pcArray,log);
                log.LogInformation(ans);
            }

            log.LogInformation("<---END Azure Function--->");
            return new OkObjectResult(ans);
        }
    