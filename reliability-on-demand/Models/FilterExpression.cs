using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace reliability_on_demand.DataLayer
{
    public class FilterExpression
    {
        public string RelationalOperator { get; set; }
        public string PivotName { get; set; }
        public string Operator { get; set; }
        public string PivotValue { get; set; }
        public int PivotID { get; set; }
        public int PivotScopeID { get; set; }
        public string UIInputDataType { get; set; }
        public string PivotKey { get; set; }
    }
}
