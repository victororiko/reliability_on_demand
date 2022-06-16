using System;
using System.ComponentModel.DataAnnotations;

namespace reliability_on_demand.DataLayer
{
    public class PopulationPivotConfig
    {
        public int StudyID { get; set; }
        public int PivotID { get; set; }
        public Boolean? AggregateBy { get; set; }
        public string PivotSourceSubType { get; set; }

        public override string ToString()
        {
            return $"PivotID = {PivotID} | StudyID = {StudyID}";
        }
    }
}
