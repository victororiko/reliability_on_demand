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

        [Route("api/Data/GetAllMainVertical")]
        [HttpGet("[action]")]
        public IActionResult GetAllMainVertical()
        {
            try
            {
                return Ok(this._sqlservice.GetVerticals());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("api/Data/GetConfiguredVerticalForAStudy/{studyID?}")]
        public IActionResult GetConfiguredVerticalForAStudy(int studyID)
        {
            _logger.LogInformation($"studyID = {studyID}");
            if (studyID <= 0)
                return BadRequest("Bad request. Please specify a sourcetype like KernelMode or UserMode");
            string res = this._sqlservice.GetConfiguredVerticalForAStudy(studyID);
            return Ok(res);
        }

        // learn more about optional params here - https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-5.0#conventional-routing-1
        [HttpGet("api/Data/GetAllailurePivotNamesForAVertical/{sourcetype?}")]
        public IActionResult GetAllailurePivotNamesForAVertical(string sourcetype)
        {
            _logger.LogInformation($"sourcetype = {sourcetype}");
            if (String.IsNullOrEmpty(sourcetype))
                return BadRequest("Bad request. Please specify a sourcetype like KernelMode or UserMode");
            string res = this._sqlservice.GetPivots(sourcetype);
            return Ok(res);
        }

        [Route("api/Data/GetAllDefaultFailurePivotsForAVertical")]
        [HttpPost("[action]")]
        public string GetAllDefaultFailurePivotsForAVertical([FromBody] FailureConfig f)
        {
            var result = this._sqlservice.GetAllDefaultFailurePivotsForAVertical(f.PivotSourceSubType);
            _logger.LogInformation("GetAllDefaultFailurePivotsForAVertical");
            _logger.LogInformation($"result = {result}");
            return result;
        }

        [HttpGet("api/Data/GetAllConfiguredFailurePivotsForAVertical/sourcesubtype/{sourcesubtype}/studyid/{studyid}")]
        public string GetAllConfiguredFailurePivotsForAVertical(string sourcesubtype, int studyid)
        {
            Console.WriteLine($"Inputs: sourcesubtype = {sourcesubtype} \t studyid = {studyid}");
            return this._sqlservice.GetAllConfiguredFailurePivotsForAVertical(sourcesubtype, studyid);
        }

        [Route("api/Data/SavedFailureConfig")]
        [HttpPost("[action]")]
        public void SavedFailureConfig([FromBody] FailureConfig fg)
        {
            this._sqlservice.UpdateFailureSavedConfig(fg);
        }

        [HttpGet("api/Data/GetDefaultMetricsConfig/{StudyId}")]
        public IActionResult GetDefaultMetricsConfig(int StudyId)
        {
            string res = this._sqlservice.GetDefaultMetricsConfig(StudyId);
            _logger.LogInformation($"GetDefaultMetricsConfig for StudyId = {StudyId}");
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

        [HttpGet("api/Data/GetMetricConfigs/{StudyId}")]
        public IActionResult GetMetricConfigs(int StudyId)
        {
            try
            {
                string res = this._sqlservice.GetMetricConfigs(StudyId);
                _logger.LogInformation($"GetMetricConfigs called with StudyId = {StudyId}");
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

        /*
        [HttpGet("api/Data/IsValidUserForAdmin")]
        public bool IsValidUserForAdmin()
        {
            ICollection<string> names = new List<string>();
            //Guid ID for cosreldata
            names.Add("f4f89fb5-761e-492a-80f3-bc0044932491");
            _logger.LogError(this.HttpContext.GetUserName());
            var isValidUser = this.graphAdapter.IsMemberAsync(this.HttpContext.GetUserName(), names).Result;
            return isValidUser;
        }
        */

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
    }
}
