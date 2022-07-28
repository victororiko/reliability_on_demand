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
        string GetAllVerticals();
        string GetConfiguredVerticalForAStudy(int StudyConfigID);
        string GetFailurePivots(string sourcesubtype);
        string GetAllDefaultFailurePivotsForAVertical(string sourcesubtype);
        string GetAllConfiguredFailurePivotsForAVertical(string sourcesubtype, int StudyConfigID);
        void UpdateFailureSavedConfig(FailureConfig f);
        string GetDefaultMetricsConfig(int StudyConfigID);
        string AddMetricConfig(MetricConfig userCreatedMetric);
        string DeleteTeam(TeamConfig team);
        string GetMetricConfigs(int StudyConfigID);
        string UpdateMetricConfig(MetricConfig userConfig);
        string DeleteMetricConfig(MetricConfig userConfig);
        string GetPopulationPivotSources();
        string GetPopulationPivots(string PivotSource);
        string GetUserPivotConfigs(string PivotSource, int StudyConfigID);
        string AddOrUpdatePivotConfig(PopulationPivotConfig userConfig);
        string ClearPivotConfig(PopulationPivotConfig userConfig);
        string GetAllScopeForPivotKeys(string pivotkeys);
        string GetFilterExpressionForPivotScopeIds(StudyConfigIDWithScopesInquiry inquiry);
    }
}
