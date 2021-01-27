using System;
using System.Collections.Generic;

namespace reliability_on_demand.DataLayer
{
    public interface ISQLService
    {
        string GetAllUnifiedConfigs();
        int LogRelCloudQuery<T>(string username, string url, string access, T payload);
        void UpdateRelCloudQuery(int id, bool status, string exception);
    }
}
