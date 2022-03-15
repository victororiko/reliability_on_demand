using System.Collections.Generic;

namespace reliability_on_demand.DataLayer
{
    public class CosmosService : ICosmosService
    {
        private RIODCosmosDbContext _context;

        public CosmosService(RIODCosmosDbContext context)
        {
            _context = context;
        }

        public void SubmitServerlessQuery()
        {
            _context.SubmitServerlessQuery();
        }
    }
}
