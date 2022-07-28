using System;
using System.ComponentModel.DataAnnotations;

namespace reliability_on_demand.DataLayer
{
    public class PopulationPivotConfig
    {
        public int StudyConfigID { get; set; }
        public string PivotKey{ get; set; }
        public Boolean? AggregateBy { get; set; }
        public string PivotSourceSubType { get; set; } // default = 'AllMode'
        
        public string PivotScopeOperator { get; set; } // default = ''
        public int PivotScopeID { get; set; } // default = -1

        public override string ToString()
        {
            return $"PivotKey = {PivotKey} | StudyConfigID = {StudyConfigID} | PivotScopeID = {PivotScopeID}";
        }
    }
}
