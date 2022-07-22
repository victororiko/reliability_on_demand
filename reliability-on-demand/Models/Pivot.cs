using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace reliability_on_demand.DataLayer
{
    public class Pivot
    {
        public int PivotID { get; set; }
        public string UIInputDataType { get; set; }
        public string PivotSourceColumnName { get; set; }
        public bool IsSelectPivot { get; set; }
        public bool IsKeyPivot { get; set; }
        public bool IsApportionPivot { get; set; }
        public bool IsApportionJoinPivot { get; set; }
        public bool IsScopeFilter { get; set; }
        public string PivotKey { get; set; }
        public bool AggregateBy { get; set; }
        public FilterExpression[] FilterExpressions { get; set; }
    }
}
