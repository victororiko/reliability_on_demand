using System.Collections.Generic;

namespace reliability_on_demand.DataLayer
{
    public class SQLService : ISQLService
    {
        private WatsonExtContext _context;


        public SQLService(WatsonExtContext context)
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

        string ISQLService.AddTeam(TeamConfig inquiry)
        {
           return _context.AddTeam(inquiry);
        }

        string ISQLService.AddStudy(StudyConfig userCreatedStudy){
            return _context.AddStudy(userCreatedStudy);
        }

        string ISQLService.GetVerticals()
        {
            string str = _context.GetVerticals();
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

        public List<TeamConfig> GetAllTeamConfigs()
        {
            return _context.GetAllTeamConfigs();
        }
    }
}
