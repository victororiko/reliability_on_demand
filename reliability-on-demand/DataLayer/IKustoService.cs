// Adapted from: https://microsoft.visualstudio.com/OS.Fun/_git/reliability.cloud?path=%2Freliability.cloud.ui%2FDataLayer%2FIKustoService.cs

namespace reliability_on_demand.DataLayer
{
    public interface IKustoService
    {
        string GetStudyInstances(int studyConfigID);
        string GetStudyFailureCurveInstances(string StudyKeyInstanceGuid);
        string GetStudyMetric(string StudyKeyInstanceGuid);
        string GetStudyStats(string StudyKeyInstanceGuid);
        string GetFailureCurveSummary(string StudyKeyInstanceGuid);
        string GetTimeFrames(string StudyKeyInstanceGuid);
    }
}
