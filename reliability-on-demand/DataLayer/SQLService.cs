﻿using reliability_on_demand.Models;
using System.Collections.Generic;

namespace reliability_on_demand.DataLayer
{
    public class SQLService : ISQLService
    {
        private RIODSQLDbContext _context;


        public SQLService(RIODSQLDbContext context)
        {
            _context = context;
        }

        string ISQLService.GetAllStudyConfigsForTeam(int TeamID)
        {
            return _context.GetAllStudyConfigsForTeam(TeamID);
        }

        string ISQLService.SaveTeam(TeamConfig inquiry)
        {
           return _context.SaveTeam(inquiry);
        }

        string ISQLService.AddStudy(StudyConfig userCreatedStudy){
            return _context.AddStudy(userCreatedStudy);
        }

        string ISQLService.UpdateStudy(StudyConfig userCreatedStudy)
        {
            return _context.UpdateStudy(userCreatedStudy);
        }

        string ISQLService.DeleteStudy(StudyConfig userCreatedStudy)
        {
            return _context.DeleteStudy(userCreatedStudy);
        }

        string ISQLService.GetAllVerticals()
        {
            string str = _context.GetAllVerticals();
            return str;
        }

        string ISQLService.GetConfiguredVerticalForAStudy(int StudyConfigID)
        {
            string str = _context.GetConfiguredVerticalForAStudy(StudyConfigID);
            return str;
        }

        string ISQLService.GetDefaultVerticalForAStudy(int StudyConfigID)
        {
            string str = _context.GetDefaultVerticalForAStudy(StudyConfigID);
            return str;
        }

        string ISQLService.GetFailurePivots(string sourcesubtype)
        {
            return _context.GetFailurePivots(sourcesubtype);
        }

        string ISQLService.GetAllDefaultFailurePivotsForAVertical(string sourcesubtype)
        {
            return _context.GetAllDefaultFailurePivotsForAVertical(sourcesubtype);
        }

        string ISQLService.GetAllConfiguredFailurePivotsForAVertical(string sourcesubtype, int StudyConfigID)
        {
            return _context.GetAllConfiguredFailurePivotsForAVertical(sourcesubtype, StudyConfigID);
        }

        void ISQLService.UpdateFailureSavedConfig(Pivot[] pivots)
        {
            _context.UpdateFailureSavedConfig(pivots);
        }

        public string GetAllTeamConfigs()
        {
            return _context.GetAllTeamConfigs();
        }
        
        string ISQLService.GetDefaultMetricsConfig(int StudyConfigID)
        {
            return _context.GetDefaultMetricsConfig(StudyConfigID);
        }

        string ISQLService.AddMetricConfig(MetricConfig userCreatedMetric){
            return _context.AddMetricConfig(userCreatedMetric);
        }
        public string DeleteTeam(TeamConfig team)
        {
            return _context.DeleteTeam(team);
        }

        string ISQLService.GetMetricConfigs(int StudyConfigID)
        {
            return _context.GetMetricConfigs(StudyConfigID);
        }

        string ISQLService.UpdateMetricConfig(MetricConfig userConfig)
        {
            return _context.UpdateMetricConfig(userConfig);
        }

        string ISQLService.DeleteMetricConfig(MetricConfig userConfig)
        {
            return _context.DeleteMetricConfig(userConfig);
        }
        string ISQLService.GetAllSourcesForGivenSourceType(string sourcetype)
        {
            return _context.GetAllSourcesForGivenSourceType(sourcetype);
        }
        string ISQLService.GetPopulationPivots(string PivotSource)
        {
            return _context.GetPopulationPivots(PivotSource);
        }
        string ISQLService.GetUserPivotConfigs(string PivotSource, int StudyConfigID)
        {
            return _context.GetUserPivotConfigs(PivotSource,StudyConfigID);
        }

        void ISQLService.AddOrUpdatePivotConfig(Pivot[] allUserConfigs)
        {
            _context.SavePivotConfig(allUserConfigs);   
        }
        string ISQLService.ClearPivotConfig(reliability_on_demand.DataLayer.Pivot userConfig)
        {
            return _context.ClearPivotConfig(userConfig);   
        }

        string ISQLService.GetAllScopeForPivotKeys(string pivotkeys)
        {
            return _context.GetAllScopeForPivotKeys(pivotkeys);
        }

        string ISQLService.GetFilterExpressionForPivotScopeIds(StudyConfigIDWithScopesInquiry inquiry)
        {
            return _context.GetFilterExpressionForPivotScopeIds(inquiry);
        }

        string ISQLService.GetPivotsForGivenSource(string source)
        {
            return _context.GetPivotsForGivenSource(source);
        }

        string ISQLService.GetAdminConfiguredPivotsData(string source)
        {
            return _context.GetAdminConfiguredPivotsData(source);
        }

        void ISQLService.SavePivotConfig(Pivot[] pivots)
        {
            _context.SavePivotConfig(pivots);
        }

        public string GetUsageColumns()
        {
            return _context.GetUsageColumns();
        }

        string ISQLService.GetPivotsAndScopesForStudyConfigID(int StudyConfigID)
        {
            return _context.GetPivotsAndScopesForStudyConfigID(StudyConfigID);
        }

        public string GetAllStudyTypes()
        {
            return _context.GetAllStudyTypes();
        }
        public string GetVerticalsForAStudyType(string StudyType)
        {
            return _context.GetVerticalsForAStudyType(StudyType);
        }

        public void SaveVerticalsForAStudyType(StudyTypeConfig config)
        {
            _context.SaveVerticalsForAStudyType(config);
        }
        public string GetStudyConfigIDsForPivotsAndScopes(Pivot[] pivots)
        {
            return _context.GetStudyConfigIDsForPivotsAndScopes(pivots);
        }

        public string GetVerticals()
        {
            return _context.GetVerticals();
        }

        public string SaveVertical(VerticalInstance verticalInstance)
        {
            return _context.SaveVertical(verticalInstance);
        }

        public string DeleteVertical(string verticalname)
        {
            return _context.DeleteVertical(verticalname);
        }
    }
}
