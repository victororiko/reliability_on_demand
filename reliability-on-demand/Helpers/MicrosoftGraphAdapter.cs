// <copyright file="MicrosoftGraphAdapter.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;

namespace reliability_on_demand.Helpers
{
    /// <summary>
    /// Connects to Microsoft Graph.
    /// </summary>
    public class MicrosoftGraphAdapter : IMicrosoftGraphAdapter
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MicrosoftGraphAdapter"/> class.
        /// </summary>
        /// <param name="authenticationProvider">The authentication provider.</param>
        public MicrosoftGraphAdapter(IConfiguration configuration)
        {
            var scopes = new[] { "https://graph.microsoft.com/.default" };

            // Multi-tenant apps can use "common",
            // single-tenant apps must use the tenant ID from the Azure portal
            var tenantId = configuration.GetValue<string>("TenantID");

            // Values from app registration
            var clientId = configuration.GetValue<string>("AppClientId");
            var clientSecret = configuration.GetValue<string>("ClientSecret");

            // using Azure.Identity;
            var options = new TokenCredentialOptions
            {
                AuthorityHost = AzureAuthorityHosts.AzurePublicCloud
            };

            // https://docs.microsoft.com/dotnet/api/azure.identity.clientsecretcredential
            var clientSecretCredential = new ClientSecretCredential(
                tenantId, clientId, clientSecret, options);

            this.GraphClient = new GraphServiceClient(clientSecretCredential,scopes);
        }

        /// <summary>Gets the client of Microsoft Graph.</summary>
        public GraphServiceClient GraphClient { get; }

        /// <summary>
        /// Checks for membership in the specified list of groups.
        /// Returns from the list those groups of which the user has a direct or transitive membership.
        /// </summary>
        /// <param name="userName">The user principal name to check.</param>
        /// <param name="groupIds">Group IDs to check membership.</param>
        /// <returns>A <see cref="Task{TResult}"/> representing the result of the asynchronous operation.</returns>
        public async Task<IEnumerable<string>> CheckMemberGroupsAsync(string userName, IEnumerable<string> groupIds)
        {
            try
            {
                return await this.GraphClient.Users[userName].CheckMemberGroups(groupIds).Request().PostAsync().ConfigureAwait(false);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return null;
        }

        /// <summary>
        /// Given a collection of user or group IDs,
        /// checks whether the specified user is in the collection directly,
        /// or is a member of any group in the collection.
        /// </summary>
        /// <param name="userName">The name of the user to check.</param>
        /// <param name="userOrGroupIds">The collection of user or group IDs.</param>
        /// <returns><c>true</c> if the specified user is a member; otherwise; <c>false</c>.</returns>
        public async Task<bool> IsMemberAsync(string userName, ICollection<string>? userOrGroupIds)
        {
            if (userOrGroupIds == default)
            {
                return false;
            }

            if (userOrGroupIds.Any(id => string.Equals(userName, id, StringComparison.OrdinalIgnoreCase)))
            {
                return true;
            }

            try
            {
                var names = userOrGroupIds.Where(id => !Guid.TryParse(id, out _));
                var groupTasks = names.Select(this.GetGroupAsync);
                var groups = await Task.WhenAll(groupTasks).ConfigureAwait(false);
                var groupIds = userOrGroupIds
                    .Where(id => Guid.TryParse(id, out _)) // Existing IDs
                    .Concat(groups.Where(g => g != default).Select(g => g!.Id)) // Queried IDs
                    .ToArray();
                var memberGroups = await this.CheckMemberGroupsAsync(userName, groupIds).ConfigureAwait(false);
                return memberGroups.Any();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        /// <summary>
        /// Gets a group by name.
        /// </summary>
        /// <param name="name">The name of the group.</param>
        /// <returns>A <see cref="Task{TResult}"/> representing the result of the asynchronous operation.</returns>
       // [CachingAdvice(CachePolicyIds.Static)]
        protected virtual async Task<Group?> GetGroupAsync(string name)
        {
            var request = this.GraphClient.Groups.Request();
            request.Filter($"mail eq '{name}'");
            var page = await request.GetAsync().ConfigureAwait(false);
            return page.FirstOrDefault();
        }

    }
}
