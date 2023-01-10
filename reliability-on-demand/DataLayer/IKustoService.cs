// Adapted from: https://microsoft.visualstudio.com/OS.Fun/_git/reliability.cloud?path=%2Freliability.cloud.ui%2FDataLayer%2FIKustoService.cs

namespace reliability_on_demand.DataLayer
{
    public interface IKustoService
    {
        string GetStudyInstances(int studyConfigID);
    }
}
