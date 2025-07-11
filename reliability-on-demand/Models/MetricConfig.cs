using System;
using System.ComponentModel.DataAnnotations;
using System.Data;

namespace reliability_on_demand.DataLayer
{
    public class MetricConfig
    {
        public string MetricName { get; set; }
        public string Vertical { get; set; }
        public float FailureRateInHour { get; set; }
        // mapping taken from https://www.tutorialspoint.com/What-is-the-Chash-Equivalent-of-SQL-Server-DataTypes
        public Int64 MinUsageInMS { get; set; } 
        public Int64 HighUsageMinInMS { get; set; }
        public float MetricGoal { get; set; }
        public float MetricGoalAspirational { get; set; }
        public int StudyConfigID { get; set; }
        public bool IsUsage { get; set; }
        public string UniqueKey { get; set; }
        public string HashString {get; set;}
        public string? PivotKey { get; set; }

        public override string ToString()
        {
            return $"MetricName = {MetricName} | StudyConfigID = {StudyConfigID}";
        }
    }
}
