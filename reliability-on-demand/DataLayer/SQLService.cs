using System;
using System.Collections.Generic;
using System.Linq;

namespace reliability_on_demand.DataLayer
{
    public class SQLService : ISQLService
    {
        private WatsonExtContext _context;

        
        public SQLService(WatsonExtContext context)
        {
            _context = context;
        }

        public List<Guid> GetStackHashCabs(StackInquiry inquiry)
        {
            return _context.GetStackHashCabs(inquiry);
        }


        public int LogRelCloudQuery<T>(string username, string url, string access, T payload)
        {
            return _context.LogRelCloudQuery(username, url, access, payload);
        }

        public void UpdateRelCloudQuery(int id, bool status, string exception)
        {
            _context.UpdateRelCloudQuery(id, status, exception);
        }
    }
}
