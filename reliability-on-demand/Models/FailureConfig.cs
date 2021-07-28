using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace reliability_on_demand.DataLayer
{
    public class FailureConfig
    {
        public int StudyID { get; set; }
        public string PivotSourceSubType { get; set; }
        public List<Pivot> Pivots { get; set; }
    }
}
