using reliability_on_demand.Models;
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
        string DeleteStudy(StudyConfig userCreatedStudy);
        string GetAllStudyConfigsForTeam(int TeamID);
        int LogRelOnDemandQuery<T>(string username, string url, string access, T payload);
        void UpdateRelOnDemandQuery(int id, bool status, string exception);
        string GetAllVerticals();
        string GetConfiguredVerticalForAStudy(int StudyConfigID);
        string GetFailurePivots(string sourcesubtype);
        string GetAllDefaultFailurePivotsForAVertical(string sourcesubtype);
        string GetAllConfiguredFailurePivotsForAVertical(string sourcesubtype, int StudyConfigID);
        void UpdateFailureSavedConfig(Pivot[] pivots);
        void SavePivotConfig(Pivot[] pivots);
        string GetDefaultMetricsConfig(int StudyConfigID);
        string AddMetricConfig(MetricConfig userCreatedMetric);
        string DeleteTeam(TeamConfig team);
        string GetMetricConfigs(int StudyConfigID);
        string UpdateMetricConfig(MetricConfig userConfig);
        string DeleteMetricConfig(MetricConfig userConfig);
        string GetAllSourcesForGivenSourceType(string sourcetype);
        string GetPopulationPivots(string PivotSource);
        string GetUserPivotConfigs(string PivotSource, int StudyConfigID);
        void AddOrUpdatePivotConfig(Pivot[] userConfig);
        string ClearPivotConfig(Pivot userConfig);
        string GetAllScopeForPivotKeys(string pivotkeys);
        string GetFilterExpressionForPivotScopeIds(StudyConfigIDWithScopesInquiry inquiry);
        string GetPivotsForGivenSource(string source);
        string GetAdminConfiguredPivotsData(string source);
        string GetPivotsAndScopesForStudyConfigID(int StudyConfigID);
        string GetUsageColumns();
        string GetAllStudyTypes();
        string GetVerticalsForAStudyType(string StudyType);
        void SaveVerticalsForAStudyType(StudyTypeConfig config);
        string GetStudyConfigIDsForPivotsAndScopes(Pivot[] pivots);
    }
}
