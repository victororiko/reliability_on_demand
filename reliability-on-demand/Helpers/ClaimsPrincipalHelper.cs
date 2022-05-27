// <copyright file="ClaimsPrincipalHelper.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>

using System;
using System.Linq;
using System.Security.Claims;

namespace reliability_on_demand.Helpers
{
    /// <summary>
    /// Helper for <see cref="ClaimsPrincipal"/>.
    /// </summary>
    public static class ClaimsPrincipalHelper
    {
        private const char EmailFlag = '@';

        private const string AppIdClaimType = "appid";

        private static readonly string[] UserIdClaimTypes =
        {
            ClaimTypes.Upn,
            ClaimTypes.WindowsAccountName,
            ClaimTypes.Email,
            ClaimTypes.Name,
            ClaimTypes.NameIdentifier,
        };

        /// <summary>
        /// Gets the user (person, machine, or application) ID from claims.
        /// </summary>
        /// <param name="claimsPrincipal">The <see cref="ClaimsPrincipal"/> that contains claims.</param>
        /// <returns>User ID or <c>null</c>.</returns>
        public static (Claim? UserIdClaim, Claim? AppIdClaim) GetAuthenticatedUserId(this ClaimsPrincipal claimsPrincipal)
        {
            (Claim? UserIdClaim, Claim? AppIdClaim) result = (null, null);
            if (!claimsPrincipal.Identities.Any(i => i.IsAuthenticated))
            {
                return result;
            }

            var mappings = claimsPrincipal.Claims.ToLookup(c => c.Type, StringComparer.OrdinalIgnoreCase);
            if (mappings.Contains(AppIdClaimType))
            {
                result.AppIdClaim = mappings[AppIdClaimType].FirstOrDefault(c => !string.IsNullOrEmpty(c.Value));
            }

            foreach (var claimType in UserIdClaimTypes)
            {
                if (mappings.Contains(claimType))
                {
                    var claims = mappings[claimType];
                    var claim = claims.FirstOrDefault(c => !string.IsNullOrEmpty(c.Value));
                    if (claim != null)
                    {
                        if (claim.Value.Contains(EmailFlag))
                        {
                            // A user ID in email format is preferred, use it immediately
                            result.UserIdClaim = claim;
                            break;
                        }
                        else if (result.UserIdClaim == null)
                        {
                            // Found a user ID that doesn't look like email. Save it but keep looking
                            result.UserIdClaim = claim;
                        }
                    }
                }
            }

            if (result.UserIdClaim == null && result.AppIdClaim != null)
            {
                // Use app ID as user ID as fallback
                result.UserIdClaim = result.AppIdClaim;
            }

            return result;
        }

        /// <summary>
        /// Gets the user name from the specified <see cref="ClaimsPrincipal"/>.
        /// </summary>
        /// <param name="claimsPrincipal">The <see cref="ClaimsPrincipal"/> to get user from.</param>
        /// <returns>The user name from <paramref name="claimsPrincipal"/>.</returns>
        public static string? GetUserName(this ClaimsPrincipal? claimsPrincipal)
        {
            var (userIdClaim, _) = claimsPrincipal?.GetAuthenticatedUserId() ?? (null, null);
            return userIdClaim?.Value;
        }
    }
}
