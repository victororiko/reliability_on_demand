// To understand this page better - please refer to: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-5.0#attribute-routing-for-rest-apis
/* Please see - to add a new method/action please follow these guidelines:
 * Use a full path like [Route("api/Data/GetAllReleases")]  
 * Not a tokenized path like [Route("api/[controller]/GetAllReleases")]
 * Why? The full path maps back to exactly how the client calls the endpoint - making future debugging easier :) 
 
 * To set up return types properly - refer to: https://docs.microsoft.com/en-us/aspnet/core/web-api/advanced/formatting?view=aspnetcore-5.0
 */
using Microsoft.AspNetCore.Mvc;
using reliability_on_demand.DataLayer;
using System;
using Microsoft.Extensions.Logging;
using reliability_on_demand.Helpers;
using reliability_on_demand.Extensions;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web.Resource;
using reliability_on_demand.Models;

namespace reliability_on_demand.Controllers
{
    [ApiController]
    public class DataController : Controller
    {
        private IKustoService _kustoservice;
        private ISQLService _sqlservice;
        private ILogger<DataController> _logger;
        private readonly IMicrosoftGraphAdapter graphAdapter;
        IOptions<ValueSettings> valueSettings;
        static readonly string[] scopeRequiredByApi = new string[] { "user_impersonation" };

        public DataController(IKustoService kustoservice, ISQLService sqlservice, ILogger<DataController> logger, IOptions<ValueSettings> valueSettings, IMicrosoftGraphAdapter graphAdapter)
        {
            this._kustoservice = kustoservice;
            this._sqlservice = sqlservice;
            this._logger = logger;
            this.graphAdapter = graphAdapter;
            this.valueSettings = valueSettings;
        }

        [Route("api/Data/GetAllReleases")]
        [HttpGet]
        public IActionResult GetAllReleases()
        {
            try
            {
                _logger.LogInformation("GetAllReleases was called");
                string str = this._kustoservice.GetAllReleases();
                return Ok(str);
            }
            catch (Exception ex)
            {
                string message = $"Failed to get all releases from Kusto.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [Route("api/Data/GetAllTeamConfigs")]
        [HttpGet]
        public IActionResult GetAllTeamConfigs()
        {
            try
            {
                _logger.LogInformation("GetAllTeamConfigs was called");
                var result = this._sqlservice.GetAllTeamConfigs();
                if (result == null)
                {
                    return BadRequest("Something wrong with the SQL Service. Could not get Teams. Please try again in a few mins.");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                string message = $"Failed GetAllTeamConfigs.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [Route("api/Data/GetStudies/{teamId}")]
        [HttpGet]
        public IActionResult GetAllStudyConfigsForTeam(int teamId)
        {
            try
            {
                _logger.LogInformation($"GetAllStudyConfigsForTeam was called | teamId = {teamId}");
                return Ok(this._sqlservice.GetAllStudyConfigsForTeam(teamId));
            }
            catch (Exception ex)
            {
                string message = $"Failed GetAllStudyConfigsForTeam.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [Route("api/Data/AddStudy")]
        [HttpPost("[action]")]
        public IActionResult AddStudy([FromBody] StudyConfig userCreatedStudy)
        {
            try
            {
                _logger.LogInformation($"AddStudy was called | StudyConfig = {userCreatedStudy}");
                return Ok(this._sqlservice.AddStudy(userCreatedStudy));
            }
            catch (Exception ex)
            {
                string message = $"Failed AddStudy.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [HttpPost("api/Data/UpdateStudy")]
        public IActionResult UpdateStudy([FromBody] StudyConfig userCreatedStudy)
        {
            try
            {
                _logger.LogInformation($"UpdateStudy was called | StudyConfig = {userCreatedStudy}");
                return Ok(this._sqlservice.UpdateStudy(userCreatedStudy));
            }
            catch (Exception ex)
            {
                string message = $"Failed UpdateStudy.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [HttpPost("api/Data/DeleteStudy")]
        public IActionResult DeleteStudy([FromBody] StudyConfig userCreatedStudy)
        {
            try
            {
                _logger.LogInformation($"DeleteStudy was called | StudyConfig = {userCreatedStudy}");
                return Ok(this._sqlservice.DeleteStudy(userCreatedStudy));
            }
            catch (Exception ex)
            {
                string message = $"Failed DeleteStudy.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [Route("api/Data/SaveTeam")]
        [HttpPost("[action]")]
        public IActionResult SaveTeam([FromBody] TeamConfig inquiry)
        {
            try
            {
                _logger.LogInformation($"SaveTeam was called | TeamConfig = {inquiry}");
                return Ok(this._sqlservice.SaveTeam(inquiry));
            }
            catch (Exception ex)
            {
                string message = $"Failed Save Team.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [Route("api/Data/DeleteTeam")]
        [HttpPost("[action]")]
        public IActionResult DeleteTeam([FromBody] TeamConfig inquiry)
        {
            try
            {
                _logger.LogInformation($"Delete Team was called | TeamConfig = {inquiry}");
                return Ok(this._sqlservice.DeleteTeam(inquiry));
            }
            catch (Exception ex)
            {
                string message = $"Failed Delete Team.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [Route("api/Data/GetAllScopeForPivotKeys")]
        [HttpPost("[action]")]
        public IActionResult GetAllScopeForPivotKeys([FromBody] string pivotkeys)
        {
            _logger.LogInformation($"Pivot Keys = {pivotkeys}");
            if (pivotkeys == null)
                return BadRequest("Bad request. Please provide pivot keys");
            string res = this._sqlservice.GetAllScopeForPivotKeys(pivotkeys);
            return Ok(res);
        }

        [Route("api/Data/GetFilterExpressionForPivotScopeIds")]
        [HttpPost("[action]")]
        public IActionResult GetFilterExpressionForPivotScopeIds([FromBody] StudyConfigIDWithScopesInquiry inquiry)
        {
            _logger.LogInformation($"Pivot Scope IDs = {inquiry}");
            if (inquiry == null)
                return BadRequest("Bad request. Please provide pivotscope ids");
            string res = this._sqlservice.GetFilterExpressionForPivotScopeIds(inquiry);
            return Ok(res);
        }

        [Route("api/Data/GetAllVerticals")]
        [HttpGet("api/Data/GetAllVerticals")]
        public IActionResult GetAllVerticals()
        {
            try
            {
                string res = this._sqlservice.GetAllVerticals();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("api/Data/GetConfiguredVerticalForAStudy/{StudyConfigID?}")]
        public IActionResult GetConfiguredVerticalForAStudy(int StudyConfigID)
        {
            _logger.LogInformation($"StudyConfigID = {StudyConfigID}");
            if (StudyConfigID <= 0)
                return BadRequest("Bad request. Please specify a sourcetype like KernelMode or UserMode");
            string res = this._sqlservice.GetConfiguredVerticalForAStudy(StudyConfigID);
            return Ok(res);
        }

        // learn more about optional params here - https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-5.0#conventional-routing-1
        [HttpGet("api/Data/GetAllFailurePivotNamesForAVertical/{sourcetype?}")]
        public IActionResult GetAllFailurePivotNamesForAVertical(string sourcetype)
        {
            _logger.LogInformation($"sourcetype = {sourcetype}");
            if (String.IsNullOrEmpty(sourcetype))
                return BadRequest("Bad request. Please specify a sourcetype like KernelMode or UserMode");
            string res = this._sqlservice.GetFailurePivots(sourcetype);
            return Ok(res);
        }

        [Route("api/Data/GetAllDefaultFailurePivotsForAVertical")]
        [HttpPost("[action]")]
        public string GetAllDefaultFailurePivotsForAVertical([FromBody] string sourcesubtype)
        {
            var result = this._sqlservice.GetAllDefaultFailurePivotsForAVertical(sourcesubtype);
            _logger.LogInformation("GetAllDefaultFailurePivotsForAVertical");
            _logger.LogInformation($"result = {result}");
            return result;
        }

        [HttpGet("api/Data/GetAllConfiguredFailurePivotsForAVertical/sourcesubtype/{sourcesubtype}/StudyConfigID/{StudyConfigID}")]
        public string GetAllConfiguredFailurePivotsForAVertical(string sourcesubtype, int StudyConfigID)
        {
            Console.WriteLine($"Inputs: sourcesubtype = {sourcesubtype} \t StudyConfigID = {StudyConfigID}");
            return this._sqlservice.GetAllConfiguredFailurePivotsForAVertical(sourcesubtype, StudyConfigID);
        }

        [Route("api/Data/SavedFailureConfig")]
        [HttpPost("[action]")]
        public void SavedFailureConfig([FromBody] Pivot[] pivots)
        {
            this._sqlservice.UpdateFailureSavedConfig(pivots);
        }

        [Route("api/Data/SavePivotConfig")]
        [HttpPost("[action]")]
        public void SavePivotConfig([FromBody] Pivot[] pivots)
        {
            this._sqlservice.SavePivotConfig(pivots);
        }

        [HttpGet("api/Data/GetDefaultMetricsConfig/{StudyConfigID}")]
        public IActionResult GetDefaultMetricsConfig(int StudyConfigID)
        {
            string res = this._sqlservice.GetDefaultMetricsConfig(StudyConfigID);
            _logger.LogInformation($"GetDefaultMetricsConfig for StudyConfigID = {StudyConfigID}");
            return Ok(res);
        }

        [Route("api/Data/AddMetricConfig")]
        [HttpPost("[action]")]
        public IActionResult AddMetricConfig([FromBody] MetricConfig userCreatedMetric)
        {
            try
            {
                _logger.LogInformation($"AddMetricConfig was called | MetricConfig = {userCreatedMetric}");
                return Ok(this._sqlservice.AddMetricConfig(userCreatedMetric));
            }
            catch (Exception ex)
            {
                string message = $"Failed AddMetricConfig.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [Route("api/Data/UpdateMetricConfig")]
        [HttpPost("[action]")]
        public IActionResult UpdateMetricConfig([FromBody] MetricConfig userCreatedMetric)
        {
            try
            {
                _logger.LogInformation($"UpdateMetricConfig was called | MetricConfig = {userCreatedMetric}");
                return Ok(this._sqlservice.UpdateMetricConfig(userCreatedMetric));
            }
            catch (Exception ex)
            {
                string message = $"Failed UpdateMetricConfig.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [HttpGet("api/Data/GetMetricConfigs/{StudyConfigID}")]
        public IActionResult GetMetricConfigs(int StudyConfigID)
        {
            try
            {
                string res = this._sqlservice.GetMetricConfigs(StudyConfigID);
                _logger.LogInformation($"GetMetricConfigs called with StudyConfigID = {StudyConfigID}");
                if (String.IsNullOrEmpty(res))
                    _logger.LogDebug("No Metrics Configured");
                return Ok(res);
            }
            catch (Exception ex)
            {
                string message = $"Failed GetMetricConfigs.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [Authorize]
        [HttpGet("api/Data/IsValidUserForAdmin")]
        public bool IsValidUserForAdmin()
        {
            ICollection<string> names = new List<string>();
            //Guid ID for cosreldata
            names.Add("f4f89fb5-761e-492a-80f3-bc0044932491");
            var isValidUser = this.graphAdapter.IsMemberAsync(this.HttpContext.GetUserName(), names).Result;
            return isValidUser;
        }

        [HttpPost("api/Data/DeleteMetricConfig/")]
        public IActionResult DeleteMetricConfig(MetricConfig userConfig)
        {
            try
            {
                string res = this._sqlservice.DeleteMetricConfig(userConfig);
                _logger.LogInformation($"DeleteMetricConfig called with userConfig = {userConfig}");
                if (String.IsNullOrEmpty(res))
                    _logger.LogDebug("No Metrics Configured");
                return Ok(res);
            }
            catch (Exception ex)
            {
                string message = $"Failed DeleteMetricConfig.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [Route("api/Data/GetAllSourcesForGivenSourceType/{sourcetype}")]
        [HttpGet]
        public IActionResult GetAllSourcesForGivenSourceType(string sourcetype)
        {
            try
            {
                _logger.LogInformation("GetPopulationPivotSources was called");
                var result = this._sqlservice.GetAllSourcesForGivenSourceType(sourcetype);
                if (result == null)
                    return BadRequest("Something wrong with the SQL Service. Could not get GetPopulationPivotSources. Please try again in a few mins.");
                return Ok(result);
            }
            catch (Exception ex)
            {
                string message = $"Failed GetPopulationPivotSources.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [HttpGet("api/Data/GetPopulationPivots/{PivotSource}")]
        public IActionResult GetPopulationPivots(string PivotSource)
        {
            try
            {
                string res = this._sqlservice.GetPopulationPivots(PivotSource);
                _logger.LogInformation($"GetPopulationPivots called with PivotSource = {PivotSource}");
                return Ok(res);
            }
            catch (Exception ex)
            {
                string message = $"Failed GetPopulationPivots.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }
        [HttpGet("api/Data/GetUserPivotConfigs/PivotSource/{PivotSource}/StudyConfigID/{StudyConfigID}")]
        public IActionResult GetUserPivotConfigs(string PivotSource, int StudyConfigID)
        {
            try
            {
                string res = this._sqlservice.GetUserPivotConfigs(PivotSource, StudyConfigID);
                _logger.LogInformation($"GetUserPivotConfigs called with PivotSource = {PivotSource}");
                return Ok(res);
            }
            catch (Exception ex)
            {
                string message = $"Failed GetUserPivotConfigs.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [HttpPost("api/Data/AddOrUpdatePivotConfig/")]
        public void AddOrUpdatePivotConfig([FromBody] Pivot[] allUserConfigs)
        {
            try
            {
                 this._sqlservice.AddOrUpdatePivotConfig(allUserConfigs);
                _logger.LogInformation("AddOrUpdatePivotConfig called with following userConfigs:\n");
                foreach(var userConfig in allUserConfigs)
                    _logger.LogInformation($"{userConfig}");
            }
            catch (Exception ex)
            {
                string message = $"Failed AddOrUpdatePivotConfig.\nException = {ex}";
                _logger.LogError(message);
            }
        }

        [HttpPost("api/Data/ClearPivotConfig/")]
        public IActionResult ClearPivotConfig(Pivot userConfig)
        {
            try
            {
                string res = this._sqlservice.ClearPivotConfig(userConfig);
                _logger.LogInformation($"ClearPivotConfig called with userConfig = {userConfig}");
                return Ok(res);
            }
            catch (Exception ex)
            { 
                string message = $"Failed ClearPivotConfig.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [HttpGet("api/Data/GetPivotsForGivenSource/{source}")]
        public IActionResult GetPivotsForGivenSource(string source)
        {
            try
            {
                string res = this._sqlservice.GetPivotsForGivenSource(source);
                return Ok(res);
            }
            catch (Exception ex)
            {
                string message = $"Failed GetPivotsForGivenSource.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }


        [HttpGet("api/Data/GetAdminConfiguredPivotsData/{source}")]
        public IActionResult GetAdminConfiguredPivotsData(string source)
        {
            try
            {
                string res = this._sqlservice.GetAdminConfiguredPivotsData(source);
                return Ok(res);
            }
            catch (Exception ex)
            {
                string message = $"Failed GetAdminConfiguredPivotsData.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [HttpGet("api/Data/GetUsageColumns")]
        public IActionResult GetUsageColumns()
        {
            try
            {
                string res = this._sqlservice.GetUsageColumns();
                return Ok(res);
            }
            catch (Exception ex)
            {
                string message = $"Failed GetUsageColumns.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [HttpGet("api/Data/GetPivotsAndScopesForStudyConfigID/{StudyConfigID}")]
        public IActionResult GetPivotsAndScopesForStudyConfigID(int StudyConfigID)
        {
            try
            {
                string res = this._sqlservice.GetPivotsAndScopesForStudyConfigID(StudyConfigID);
                return Ok(res);
            }
            catch (Exception ex)
            {
                string message = $"Failed GetPivotsAndScopesForStudyConfigID.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [HttpGet("api/Data/GetAllStudyTypes")]
        public IActionResult GetAllStudyTypes()
        {
            try
            {
                string res = this._sqlservice.GetAllStudyTypes();
                return Ok(res);
            }
            catch (Exception ex)
            {
                string message = $"Failed GetAllStudyTypes.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [HttpGet("api/Data/GetVerticalsForAStudyType/{StudyType}")]
        public IActionResult GetVerticalsForAStudyType(string StudyType)
        {
            try
            {
                string res = this._sqlservice.GetVerticalsForAStudyType(StudyType);
                return Ok(res);
            }
            catch (Exception ex)
            {
                string message = $"Failed GetVerticalsForAStudyType.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [HttpPost("api/Data/GetVerticalsForAStudyType")]
        public void GetVerticalsForAStudyType([FromBody]StudyTypeConfig config)
        {
            try
            {
                this._sqlservice.SaveVerticalsForAStudyType(config);
            }
            catch (Exception ex)
            {
                string message = $"Failed GetVerticalsForAStudyType.\nException = {ex}";
                _logger.LogError(message);
            }
        }

        [HttpPost("api/Data/GetStudyConfigIDsForPivotsAndScopes/")]
        public IActionResult GetStudyConfigIDsForPivotsAndScopes(Pivot[] userConfigs)
        {
            try
            {
                string res = this._sqlservice.GetStudyConfigIDsForPivotsAndScopes(userConfigs);
                _logger.LogInformation($"GetStudyConfigIDsForPivotsAndScopes called with userConfigs = {userConfigs}");
                return Ok(res);
            }
            catch (Exception ex)
            { 
                string message = $"Failed GetStudyConfigIDsForPivotsAndScopes.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }
    }
}
