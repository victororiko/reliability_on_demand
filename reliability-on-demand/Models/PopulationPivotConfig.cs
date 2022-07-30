using System;
using System.ComponentModel.DataAnnotations;

namespace reliability_on_demand.DataLayer
{
    public class PopulationPivotConfig
    {
        public string PivotKey{ get; set; }
        public int StudyConfigID { get; set; }
        public int PivotScopeID { get; set; } // default = -1
        public bool AggregateBy { get; set; }
        public string PivotSourceSubType { get; set; } // default = 'AllMode'
        public string RelationalOperator { get; set; } // default = ''
        // RELPivotScope specific properties
        public string PivotOperator { get; set; }
        public string PivotScopeValue { get; set; }


        public override string ToString()
        {
            return $"PivotKey = {PivotKey} | StudyConfigID = {StudyConfigID} | PivotScopeID = {PivotScopeID} | AggregateBy = {AggregateBy} | PivotSourceSubType = {PivotSourceSubType} | RelationalOperator = {RelationalOperator} | PivotOperator = {PivotOperator} | PivotScopeValue = {PivotScopeValue} ";
        }
    }
}
