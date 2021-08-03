using System;
using System.Collections.Generic;

namespace reliability_on_demand.DataLayer
{
    public interface ISQLService
    {
        string GetAllUnifiedConfigs();
        string GetAllTeamConfigs();

        string GetAllStudyConfigsForTeam(ConfigInquiry inquiry);
        string AddTeam(TeamConfig inquiry);
        int LogRelOnDemandQuery<T>(string username, string url, string access, T payload);
        void UpdateRelOnDemandQuery(int id, bool status, string exception);

        string GetAllMainVerticals();
        string GetAllailurePivotNamesForAVertical(string sourcesubtype);
        string GetAllDefaultFailurePivotsForAVertical(string sourcesubtype);
        string GetAllConfiguredFailurePivotsForAVertical(FailureConfig f);
        void UpdateFailureSavedConfig(FailureConfig f);
        string ValidateAzureFunctionCall();

    }
}
