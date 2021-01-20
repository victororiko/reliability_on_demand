// To understand this page better - please refer to: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-5.0#attribute-routing-for-rest-apis
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
    //  [Authorize(Roles = @"redmond\osgdataextended, ntdev\osgdataextendedntdev, wingroup\osgdataextendedwingroup")]
    //  [Authorize(Roles = @"redmond\osgdataextended, wingroup\osgdataextendedwingroup")]
    //[Authorize]
    [ApiController]
    public class DataController : Controller
    {
        //private IKustoService _kustoservice;

        //public DataController(IKustoService kustoservice)
        //{
        //    this._kustoservice = kustoservice;
        //}
        public DataController() { }
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
            //string str = this._kustoservice.GetAllReleases();
            string str = "hello from DataController";
            return str;
        }

    }
}
