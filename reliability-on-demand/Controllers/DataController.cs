// To understand this page better - please refer to: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-5.0#attribute-routing-for-rest-apis
/* Please see - to add a new method/action please follow these guidelines:
 * Use a full path like [Route("api/Data/GetAllReleases")]  
 * Not a tokenized path like [Route("api/[controller]/GetAllReleases")]
 * Why? The full path maps back to exactly how the client calls the endpoint - making future debugging easier :) 
 */
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using reliability_on_demand.DataLayer;


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
        [Route("api/Data/GetAllStudyConfigsForTeam/{id?}")]
        // [HttpGet("{id}")]   // GET api/Data/GetAllStudyConfigsForTeam/3 <-- TeamId
        public string GetAllStudyConfigsForTeam(int TeamID)
        {
            return this._sqlservice.GetAllStudyConfigsForTeam(3);
        }

    }
}
