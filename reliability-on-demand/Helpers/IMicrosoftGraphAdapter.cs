using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Graph;

namespace reliability_on_demand.Helpers
{
    public interface IMicrosoftGraphAdapter
    {
        Task<IEnumerable<string>> CheckMemberGroupsAsync(string userName, IEnumerable<string> groupIds);
        Task<bool> IsMemberAsync(string userName, ICollection<string>? userOrGroupIds);
    }
}
