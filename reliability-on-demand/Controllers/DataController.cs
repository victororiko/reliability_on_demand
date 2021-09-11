// To understand this page better - please refer to: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-5.0#attribute-routing-for-rest-apis
/* Please see - to add a new method/action please follow these guidelines:
 * Use a full path like [Route("api/Data/GetAllReleases")]  
 * Not a tokenized path like [Route("api/[controller]/GetAllReleases")]
 * Why? The full path maps back to exactly how the client calls the endpoint - making future debugging easier :) 
 */
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using reliability_on_demand.DataLayer;
using System.Collections.Generic;

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

        public DataController(IKustoService kustoservice, ISQLService sqlservice)
        {
            this._kustoservice = kustoservice;
            this._sqlservice = sqlservice;
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
        public string GetAllReleases()
        {
            string str = this._kustoservice.GetAllReleases();
            return str;
        }

        [Route("api/Data/GetAllUnifiedConfigs")]
        [HttpGet]
        public string GetAllUnifiedConfigs()
        {
            return this._sqlservice.GetAllUnifiedConfigs();
        }

        [Route("api/Data/GetAllTeamConfigs")]
        [HttpGet]
        public string GetAllTeamConfigs()
        {
            return this._sqlservice.GetAllTeamConfigs();
        }

        //GetAllStudyConfigsForTeam
        [Route("api/Data/GetAllStudyConfigsForTeam")]
        [HttpPost("[action]")]
        public string GetAllStudyConfigsForTeam([FromBody]ConfigInquiry inquiry)
        {
            return this._sqlservice.GetAllStudyConfigsForTeam(inquiry);
        }

        [Route("api/Data/AddTeam")]
        [HttpPost("[action]")]
        public string AddTeam([FromBody]TeamConfig inquiry)
        {
            return this._sqlservice.AddTeam(inquiry);
        }

        [Route("api/Data/GetAllMainVertical")]
        [HttpPost("[action]")]
        public string GetAllMainVertical()
        {
            return this._sqlservice.GetAllMainVerticals();
        }

        [Route("api/Data/GetAllailurePivotNamesForAVertical")]
        [HttpPost("[action]")]
        public string GetAllailurePivotNamesForAVertical([FromBody]string sourcetype)
        {
            string res = this._sqlservice.GetAllailurePivotNamesForAVertical(sourcetype);
            return res;
        }

        [Route("api/Data/GetAllDefaultFailurePivotsForAVertical")]
        [HttpPost("[action]")]
        public string GetAllDefaultFailurePivotsForAVertical([FromBody]FailureConfig f)
        {
            return this._sqlservice.GetAllDefaultFailurePivotsForAVertical(f.PivotSourceSubType);
        }

        [Route("api/Data/GetAllConfiguredFailurePivotsForAVertical")]
        [HttpPost("[action]")]
        public string GetAllConfiguredFailurePivotsForAVertical([FromBody]FailureConfig f)
        {
            return this._sqlservice.GetAllConfiguredFailurePivotsForAVertical(f);
        }

        [Route("api/Data/SavedFailureConfig")]
        [HttpPost("[action]")]
        public void SavedFailureConfig([FromBody]FailureConfig fg)
        {
            this._sqlservice.UpdateFailureSavedConfig(fg);
        }

        [Route("api/Data/ValidateAzureFunctionCall")]
        [HttpPost("[action]")]
        public string ValidateAzureFunctionCall()
        {
            string res =  this._sqlservice.ValidateAzureFunctionCall();
            return res;
        }
    }
}
