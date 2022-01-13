using System;
using System.Collections.Generic;

namespace reliability_on_demand.DataLayer
{
    public interface ISQLService
    {
        string GetAllUnifiedConfigs();
        List<TeamConfig> GetAllTeamConfigs();
        string AddTeam(TeamConfig inquiry);
        string AddStudy(StudyConfig userCreatedStudy);
        string GetAllStudyConfigsForTeam(int TeamID);
        int LogRelOnDemandQuery<T>(string username, string url, string access, T payload);
        void UpdateRelOnDemandQuery(int id, bool status, string exception);
        string GetVerticals();
        string GetConfiguredVerticalForAStudy(int studyID);
        string GetPivots(string sourcesubtype);
        string GetAllDefaultFailurePivotsForAVertical(string sourcesubtype);
        string GetAllConfiguredFailurePivotsForAVertical(string sourcesubtype, int studyid);
        void UpdateFailureSavedConfig(FailureConfig f);
    }
}
