using System;

namespace reliability_on_demand.DataLayer
{
    public class StackInquiry
    {
        public Guid FailureHash { get; set; }
        public string ProcessName { get; set; }
        public string PackageVersion { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public string UserName { get; set; }
        public int? MinBuild { get; set; }
        public int? MaxBuild { get; set; }
        public StackHashCategory Frame { get; set; }
        public string StackHash { get; set; }
        public string Branch { get; set; }
        public Guid? CabGuid { get; set; }
    }
}
