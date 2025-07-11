/* eslint-disable max-len */
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { FailureCurveInstance } from "../../models/failurecurve.model"
import { defaultOfSixtyMins } from "../helpers/utils"

export const useStudyTimeFrameQuery = (StudyKeyInstanceGuidStr: string) => {
    return useQuery({
        queryKey: ["studyTimeFrames", StudyKeyInstanceGuidStr],
        queryFn: () => {
            return axios
                .get(`api/Data/GetTimeFrames/StudyKeyInstanceGuid/${StudyKeyInstanceGuidStr}`)
                .then((res) => {
                    return res.data
                })
        },
        staleTime: defaultOfSixtyMins,
    })
}

export const useFailureCurveQuery = (StudyKeyInstanceGuidStr: string, selectionCriteria: any) => {
    return useQuery({
        queryKey: [`failureCurveQuery`, `${StudyKeyInstanceGuidStr}`],
        queryFn: () => {
            return axios
                .get(
                    `api/Data/GetStudyFailureCurveInstances/StudyKeyInstanceGuid/${StudyKeyInstanceGuidStr}`
                )
                .then((res) => {
                    return res.data
                })
        },
        staleTime: defaultOfSixtyMins,
        select: selectionCriteria,
    })
}

export const useFailureCurveSummaryQuery = (
    StudyKeyInstanceGuidStr: string,
    selectionCriteria: any
) => {
    return useQuery({
        queryKey: [`failureCurveSummaryQuery`, `${StudyKeyInstanceGuidStr}`],
        queryFn: () => {
            return axios
                .get(
                    `api/Data/GetFailureCurveSummary/StudyKeyInstanceGuid/${StudyKeyInstanceGuidStr}`
                )
                .then((res) => {
                    return res.data
                })
        },
        staleTime: defaultOfSixtyMins,
        select: selectionCriteria,
    })
}

export const useMetricsQuery = (StudyKeyInstanceGuidStr: string, selectionCriteria: any) => {
    return useQuery({
        queryKey: [`metricsQuery`, `${StudyKeyInstanceGuidStr}`],
        queryFn: () => {
            return axios
                .get(`api/Data/GetStudyMetric/StudyKeyInstanceGuid/${StudyKeyInstanceGuidStr}`)
                .then((res) => {
                    return res.data
                })
        },
        staleTime: defaultOfSixtyMins,
        select: selectionCriteria,
    })
}

export const useStudyStatsQuery = (StudyKeyInstanceGuidStr: string) => {
    return useQuery({
        queryKey: [`studyStatsQuery`, `${StudyKeyInstanceGuidStr}`],
        queryFn: () => {
            return axios
                .get(`api/Data/GetStudyStats/StudyKeyInstanceGuid/${StudyKeyInstanceGuidStr}`)
                .then((res) => {
                    return res.data
                })
        },
        staleTime: defaultOfSixtyMins,
    })
}

export const extractLinks = (item: FailureCurveInstance) => {
    const { FailureHash, BugID, FailureMode } = item
    // by default assume failure mode is user mode
    let FailureQualifier = "Failure"
    let HeatmapQualifier = "FailureHeatMap"

    // modify qualifiers if failure mode is kernel mode
    if (FailureMode === "KernelMode") {
        FailureQualifier = "KernelFailure"
        HeatmapQualifier = "KernelHeatMap"
    }

    return {
        FailureLink: `https://watsonportal.microsoft.com/${FailureQualifier}?FailureSearchText=${FailureHash}&DateRange=Last%2030%20Days&DateTimeFormat=UTC&MaxRows=100&DisplayMetric=CabCount`,
        BugLink: `https://microsoft.visualstudio.com/DefaultCollection/OS/_workitems/edit/${BugID}`,
        HeatmapLink: `https://watsonportal.microsoft.com/${HeatmapQualifier}?FailureSearchText=${FailureHash}&DateRange=Last+30+Days&DateTimeFormat=UTC&MaxRows=100&DisplayMetric=CabCount`,
    }
}

export interface TableFilter {
    id: string
    value: any
}
