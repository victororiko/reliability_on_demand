using System;

namespace reliability_on_demand.DataLayer
{
    public class FailureInfo
    {
        public Guid? FailureHash { get; set; }
        public string FailureName { get; set; }
        public string ModuleName { get; set; }
        public string FailureFunction { get; set; }
        public long ExceptionCode { get; set; }
        public int? CabCount { get; set; }
    }
}
