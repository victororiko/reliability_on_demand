using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace reliability_on_demand.Helpers
{
    /// <summary>
    /// Helper methods for <see cref="HttpContext"/>.
    /// </summary>
    public static class HttpContextHelper
    {
        /// <summary>
        /// Returns the user principal name from request headers.
        /// </summary>
        /// <param name="httpContext">The current context of the request.</param>
        /// <returns>The user principal name who sent the request.</returns>
        public static string GetUserName(this HttpContext httpContext)
        {
            var userName = httpContext.User.GetUserName();
            
            if (!string.IsNullOrWhiteSpace(userName))
            {
                return userName;
            }

            if (httpContext.Request.Headers.TryGetValue("X-MS-CLIENT-PRINCIPAL-NAME", out var userPrincipalName))
            {
                userName = userPrincipalName.ToString();
                if (!string.IsNullOrWhiteSpace(userName))
                {
                    return userName;
                }
            }

            throw new Exception("Anonymous user is not authorized.");
        }
    }
}
