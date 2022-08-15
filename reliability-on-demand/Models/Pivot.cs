using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace reliability_on_demand.DataLayer
{
    public class Pivot
    {
        public int PivotID { get; set; }
        public string UIDataType { get; set; }
        public string PivotName { get; set; }
        public bool IsSelectColumn { get; set; }
        public bool IsKeyColumn { get; set; }
        public bool IsApportionColumn { get; set; }
        public bool IsApportionJoinColumn { get; set; }
        public bool IsScopeFilter { get; set; }
        public string PivotKey { get; set; }
        public bool AggregateBy { get; set; }
        public string ADLDataType { get; set; }
        public string PivotExpression { get; set; }
        public string[] Verticals { get; set; }
        public string PivotSourceSubType { get; set; }
        public string PivotScopeValue { get; set; }
        public string PivotOperator { get; set; }
        public string RelationalOperator { get; set; }
        public int PivotScopeID { get; set; }
        public int StudyConfigID { get; set; }
    }
}
