import React from 'react'
import { Stack, Text } from '@fluentui/react'
import { LowUsageMinimum } from './LowUsageMinimum'
import { HighUsageMinimum } from './HighUsageMinimum'
import { horizontalStackTokens } from '../helpers/Styles'
import { FailureRate } from './FailureRate'
import { AddMetricConfigButton } from './AddMetricConfigButton'
import { Metric } from './model'
import { CreateNewID } from '../helpers/utils'

interface Props {
  metricData: Metric[]
  studyid: number
}

export const MetricDetails = (props: Props) => {
  const userMetric = {} as Metric
  userMetric.Vertical = props.metricData[0].Vertical ?? ''
  userMetric.MetricName = props.metricData[0].MetricName ?? ''
  userMetric.MinUsageInMS = props.metricData[0].MinUsageInMS ?? 0
  userMetric.HighUsageMinInMS = props.metricData[0].HighUsageMinInMS ?? 0
  userMetric.FailureRateInHour = props.metricData[0].FailureRateInHour ?? 0
  userMetric.StudyId = props.studyid ?? CreateNewID

  const updateUserMetricMinUsage = (minUsage: number) => {
    userMetric.MinUsageInMS = minUsage
  }
  const updateUserMetricHighMinUsage = (highMinUsage: number) => {
    userMetric.HighUsageMinInMS = highMinUsage
  }
  const updateUserMetricFailureRate = (failureRate: number) => {
    userMetric.FailureRateInHour = failureRate
  }

  return (
    <div>
      {props.metricData[0].IsUsage ? (
        <div>
          <Text variant="xLarge">Usage</Text>
          <Stack horizontal tokens={horizontalStackTokens}>
            <LowUsageMinimum
              title="Low Usage Minimum"
              metricData={props.metricData}
              callback={updateUserMetricMinUsage}
            />
            <HighUsageMinimum
              title="High Usage Minimum"
              metricData={props.metricData}
              callback={updateUserMetricHighMinUsage}
            />
          </Stack>
        </div>
      ) : (
        // not a usage metric - show empty div
        <div />
      )}
      <FailureRate
        metricData={props.metricData}
        callback={updateUserMetricFailureRate}
      />
      <AddMetricConfigButton userMetric={userMetric} />
    </div>
  )
}
