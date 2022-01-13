// To understand this page better - please refer to: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-5.0#attribute-routing-for-rest-apis
/* Please see - to add a new method/action please follow these guidelines:
 * Use a full path like [Route("api/Data/GetAllReleases")]  
 * Not a tokenized path like [Route("api/[controller]/GetAllReleases")]
 * Why? The full path maps back to exactly how the client calls the endpoint - making future debugging easier :) 
 
 * To set up return types properly - refer to: https://docs.microsoft.com/en-us/aspnet/core/web-api/advanced/formatting?view=aspnetcore-5.0
 */
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using reliability_on_demand.DataLayer;
using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;

namespace reliability_on_demand.Controllers
{
    //  [Authorize(Roles = @"redmond\osgdataextended, ntdev\osgdataextendedntdev, wingroup\osgdataextendedwingroup")]
    //  [Authorize(Roles = @"redmond\osgdataextended, wingroup\osgdataextendedwingroup")]
    //[Authorize]
    [ApiController]
    public class DataController : Controller
    {
        private IKustoService _kustoservice;
        private ISQLService _sqlservice;
        private ILogger<DataController> _logger;

        public DataController(IKustoService kustoservice, ISQLService sqlservice, ILogger<DataController> logger)
        {
            this._kustoservice = kustoservice;
            this._sqlservice = sqlservice;
            this._logger = logger;
        }
        /// <summary>
        /// Reliability Metrics Monitor GetAllReleases
        /// </summary>
        /// <group>Reliability Metrics Monitor GetAllReleases</group>
        /// <verb>GET</verb>
        /// <url>https://reliabilityondemand.azurewebsites.net/api/Data/GetAllReleases</url>
        /// <security type="oauth2" name="oauth">
        /// </security>
        //[Authorize]
        [Route("api/Data/GetAllReleases")]
        [HttpGet]
        public IActionResult GetAllReleases()
        {
            try{
                _logger.LogInformation("GetAllReleases was called");
                string str = this._kustoservice.GetAllReleases();
                return Ok(str);    
            }
            catch(Exception ex){
                string message = $"Failed to get all releases from Kusto.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [Route("api/Data/GetAllTeamConfigs")]
        [HttpGet]
        public IActionResult GetAllTeamConfigs()
        {
            try{
                _logger.LogInformation("GetAllTeamConfigs was called");
                var result = this._sqlservice.GetAllTeamConfigs();
                if (result == null)
                {
                    return BadRequest("Something wrong with the SQL Service. Could not get Teams. Please try again in a few mins.");
                }
                return Ok(result);
            }
            catch(Exception ex){
                string message = $"Failed GetAllTeamConfigs.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [Route("api/Data/GetStudies/{teamId}")]
        [HttpGet]
        public IActionResult GetAllStudyConfigsForTeam(int teamId)
        {
            try{
                _logger.LogInformation($"GetAllStudyConfigsForTeam was called | teamId = {teamId}");
                // TODO remove ConfigInquiry
                ConfigInquiry inquiry = new ConfigInquiry();
                inquiry.TeamID = teamId;
                return Ok(this._sqlservice.GetAllStudyConfigsForTeam(inquiry.TeamID));
            }
            catch(Exception ex){
                string message = $"Failed GetAllStudyConfigsForTeam.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [Route("api/Data/AddStudy")]
        [HttpPost("[action]")]
        public IActionResult AddStudy([FromBody] StudyConfig userCreatedStudy)
        {
            try{
                _logger.LogInformation($"AddStudy was called | StudyConfig = {userCreatedStudy}");
                return Ok(this._sqlservice.AddStudy(userCreatedStudy));
            }
            catch(Exception ex){
                string message = $"Failed AddStudy.\nException = {ex}";
                _logger.LogError(message);
                return BadRequest(message);
            }
        }

        [Route("api/Data/AddTeam")]
        [HttpPost("[action]")]
        public string AddTeam([FromBody] TeamConfig inquiry)
        {
            return this._sqlservice.AddTeam(inquiry);
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
            if(String.IsNullOrEmpty(sourcetype))
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
    }
}
