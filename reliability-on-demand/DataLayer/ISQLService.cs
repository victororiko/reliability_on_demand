using System;
using System.Collections.Generic;

namespace reliability_on_demand.DataLayer
{
    public interface ISQLService
    {
        string GetAllUnifiedConfigs();
        string GetAllTeamConfigs();
        string SaveTeam(TeamConfig inquiry);
        string AddStudy(StudyConfig userCreatedStudy);
        string UpdateStudy(StudyConfig userCreatedStudy);
        string GetAllStudyConfigsForTeam(int TeamID);
        int LogRelOnDemandQuery<T>(string username, string url, string access, T payload);
        void UpdateRelOnDemandQuery(int id, bool status, string exception);
        string GetVerticals();
        string GetConfiguredVerticalForAStudy(int studyID);
        string GetPivots(string sourcesubtype);
        string GetAllDefaultFailurePivotsForAVertical(string sourcesubtype);
        string GetAllConfiguredFailurePivotsForAVertical(string sourcesubtype, int studyid);
        void UpdateFailureSavedConfig(FailureConfig f);
        string GetDefaultMetricsConfig(int StudyId);
        string AddMetricConfig(MetricConfig userCreatedMetric);
        string DeleteTeam(TeamConfig team);
        string GetMetricConfigs(int StudyId);
        string UpdateMetricConfig(MetricConfig userConfig);
        string DeleteMetricConfig(MetricConfig userConfig);
        string GetPopulationPivotSources();
        string GetPopulationPivots(string PivotSource);
    }
}
