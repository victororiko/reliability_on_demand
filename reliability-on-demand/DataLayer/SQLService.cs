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

        string ISQLService.GetAllTeamConfigs()
        {
            return _context.GetAllTeamConfigs();
        }

        string ISQLService.GetAllStudyConfigsForTeam(ConfigInquiry inquiry)
        {
            return _context.GetAllStudyConfigsForTeam(inquiry);
        }

        string ISQLService.AddTeam(TeamConfig inquiry)
        {
           return _context.AddTeam(inquiry);
        }

        string ISQLService.GetAllMainVerticals()
        {
            string str = _context.GetAllMainVerticals();
            return str;
        }

        string ISQLService.GetAllailurePivotNamesForAVertical(string sourcesubtype)
        {
            return _context.GetAllailurePivotNamesForAVertical(sourcesubtype);
        }

        string ISQLService.GetAllDefaultFailurePivotsForAVertical(string sourcesubtype)
        {
            return _context.GetAllDefaultFailurePivotsForAVertical(sourcesubtype);
        }

        string ISQLService.GetAllConfiguredFailurePivotsForAVertical(FailureConfig f)
        {
            return _context.GetAllConfiguredFailurePivotsForAVertical(f.PivotSourceSubType, f.StudyID);
        }

        void ISQLService.UpdateFailureSavedConfig(FailureConfig f)
        {
            _context.UpdateFailureSavedConfig(f);
        }
    }
}
