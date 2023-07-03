using System;

namespace reliability_on_demand.DataLayer
{
    public class VerticalInstance
    {
        public int VerticalID { get; set; }
        public string VerticalName { get; set; }
        public string FailureEventNameList { get; set; }
        public string FailureEventGroup { get; set; }
        public string PivotSourceSubType { get; set; }
        public bool IsSubVertical { get; set; }
        public string ParentVerticalName { get; set; }
        public string FailureSourceName { get; set; }
        public string AuxiliaryClause { get; set; }
        public string ImportantProcessClause { get; set; }
        public string Scenario1Clause { get; set; }
        public bool FailureFeederIgnored { get; set; }
        public string HashString { get; set; }
    }
}
