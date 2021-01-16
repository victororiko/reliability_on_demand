using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using reliability_on_demand.DataLayer;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace reliability_on_demand.Controllers
{
    public class DataController : Controller
    {
        private IKustoService _kustoservice;

        public DataController(IKustoService kustoservice)
        {
            this._kustoservice = kustoservice;
        }

        /// <summary>
        /// Reliability Metrics Monitor GetAllReleases
        /// </summary>
        /// <group>Reliability Metrics Monitor GetAllReleases</group>
        /// <verb>GET</verb>
        /// <url>https://reliabilityondemand.azurewebsites.net/api/Data/GetAllReleases</url>
        /// <security type="oauth2" name="oauth">
        /// </security>
        [Authorize]
        [HttpGet("[action]")]
        public string GetAllReleases()
        {
            string str = this._kustoservice.GetAllReleases();
            return str;
        }

    }
}
