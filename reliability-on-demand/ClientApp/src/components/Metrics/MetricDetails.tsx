import { Stack, Text } from "@fluentui/react"
import React from "react"
import { Metric } from "../../models/metric.model"
import { horizontalStackTokens } from "../helpers/Styles"
import { CreateNewID } from "../helpers/utils"
import { AddMetricConfigButton } from "./AddMetricConfigButton"
import { DeleteMetricConfigButton } from "./DeleteMetricConfigButton"
import { FailureRate } from "./FailureRate"
import { HighUsageMinimum } from "./HighUsageMinimum"
import { LowUsageMinimum } from "./LowUsageMinimum"
import { UsageColumnSingleSelectDropdown } from "./UsageColumnsSingleSelectDropdown"

interface Props {
    isUserMetric: boolean
    metricData: Metric | undefined
    StudyConfigID: number
    callbackDeleteMetric: any
    callbackAddMetric: any
}

export const MetricDetails = (props: Props) => {
    const userMetric = {} as Metric
    userMetric.IsUsage = props.metricData ? props.metricData.IsUsage : true
    userMetric.Vertical = props.metricData ? props.metricData.Vertical : ""
    userMetric.MetricName = props.metricData ? props.metricData.MetricName : ""
    userMetric.MinUsageInMS = props.metricData ? props.metricData.MinUsageInMS : 0
    userMetric.HighUsageMinInMS = props.metricData ? props.metricData.HighUsageMinInMS : 0
    userMetric.FailureRateInHour = props.metricData ? props.metricData.FailureRateInHour : 0
    userMetric.StudyConfigID = props.StudyConfigID ?? CreateNewID

    userMetric.UniqueKey = props.metricData ? props.metricData.UniqueKey : ""
    userMetric.PivotKey =
        props.metricData && props.metricData.PivotKey !== undefined
            ? props.metricData.PivotKey
            : "AggregatedAppUsageMetricsHourly.ss_InteractivityDurationMS"

    // callbacks
    const updateUserMetricMinUsage = (minUsage: number) => {
        userMetric.MinUsageInMS = minUsage
    }
    const updateUserMetricHighMinUsage = (highMinUsage: number) => {
        userMetric.HighUsageMinInMS = highMinUsage
    }
    const updateUserMetricFailureRate = (failureRate: number) => {
        userMetric.FailureRateInHour = failureRate
    }
    const updateUsagePivotColumn = (pivotKey: string) => {
        userMetric.PivotKey = pivotKey
    }

    // render()
    return (
        <div>
            {props.metricData && props.metricData.IsUsage ? (
                <div>
                    <Text variant="xLarge">Usage</Text>
                    <UsageColumnSingleSelectDropdown
                        metricData={props.metricData}
                        callback={updateUsagePivotColumn}
                    />
                    <Stack horizontal tokens={horizontalStackTokens}>
                        <LowUsageMinimum
                            title="Minimum Low Usage"
                            metricData={props.metricData}
                            callback={updateUserMetricMinUsage}
                        />
                        <HighUsageMinimum
                            title="Minimum High Usage"
                            metricData={props.metricData}
                            callback={updateUserMetricHighMinUsage}
                        />
                    </Stack>
                </div>
            ) : (
                // not a usage metric - show empty div
                <div />
            )}
            <FailureRate metricData={props.metricData} callback={updateUserMetricFailureRate} />
            <Stack horizontal tokens={horizontalStackTokens}>
                <AddMetricConfigButton
                    userMetric={userMetric}
                    isUserMetric={props.isUserMetric}
                    callbackAddMetric={props.callbackAddMetric}
                />
                {props.isUserMetric ? (
                    <DeleteMetricConfigButton
                        userMetric={userMetric}
                        isUserMetric={props.isUserMetric}
                        callbackDeleteMetric={props.callbackDeleteMetric}
                    />
                ) : (
                    ""
                )}
            </Stack>
        </div>
    )
}
