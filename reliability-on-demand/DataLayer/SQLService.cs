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

        public string GetAllUnifiedConfigs()
        {
            return _context.GetAllUnifiedConfigs();
        }

        public int LogRelOnDemandQuery<T>(string username, string url, string access, T payload)
        {
            return _context.LogRelOnDemandQuery(username, url, access, payload);
        }

        public void UpdateRelOnDemandQuery(int id, bool status, string exception)
        {
            _context.UpdateRelOnDemandQuery(id, status, exception);
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

        string ISQLService.GetVerticals()
        {
            string str = _context.GetVerticals();
            return str;
        }

        string ISQLService.GetConfiguredVerticalForAStudy(int studyID)
        {
            string str = _context.GetConfiguredVerticalForAStudy(studyID);
            return str;
        }

        string ISQLService.GetPivots(string sourcesubtype)
        {
            return _context.GetPivots(sourcesubtype);
        }

        string ISQLService.GetAllDefaultFailurePivotsForAVertical(string sourcesubtype)
        {
            return _context.GetAllDefaultFailurePivotsForAVertical(sourcesubtype);
        }

        string ISQLService.GetAllConfiguredFailurePivotsForAVertical(string sourcesubtype, int studyid)
        {
            return _context.GetAllConfiguredFailurePivotsForAVertical(sourcesubtype, studyid);
        }

        void ISQLService.UpdateFailureSavedConfig(FailureConfig f)
        {
            _context.UpdateFailureSavedConfig(f);
        }

        public string GetAllTeamConfigs()
        {
            return _context.GetAllTeamConfigs();
        }
        
        string ISQLService.GetDefaultMetricsConfig(int StudyId)
        {
            return _context.GetDefaultMetricsConfig(StudyId);
        }

        string ISQLService.AddMetricConfig(MetricConfig userCreatedMetric){
            return _context.AddMetricConfig(userCreatedMetric);
        }
        public string DeleteTeam(TeamConfig team)
        {
            return _context.DeleteTeam(team);
        }

        string ISQLService.GetMetricConfigs(int StudyId)
        {
            return _context.GetMetricConfigs(StudyId);
        }

        string ISQLService.UpdateMetricConfig(MetricConfig userConfig)
        {
            return _context.UpdateMetricConfig(userConfig);
        }

        string ISQLService.DeleteMetricConfig(MetricConfig userConfig)
        {
            return _context.DeleteMetricConfig(userConfig);
        }
    }
}
