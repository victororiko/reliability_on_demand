import React from 'react'
import { Stack, Text } from '@fluentui/react'
import { LowUsageMinimum } from './LowUsageMinimum'
import { HighUsageMinimum } from './HighUsageMinimum'
import { horizontalStackTokens } from '../helpers/Styles'
import { FailureRate } from './FailureRate'
import { AddMetricConfigButton } from './AddMetricConfigButton'
import { Metric } from '../../models/metric.model'
import { CreateNewID } from '../helpers/utils'
import { DeleteMetricConfigButton } from './DeleteMetricConfigButton'

interface Props {
  isUserMetric: boolean
  metricData: Metric | undefined
  studyid: number
}

export const MetricDetails = (props: Props) => {
  const userMetric = {} as Metric
  userMetric.IsUsage = props.metricData ? props.metricData.IsUsage : true
  userMetric.Vertical = props.metricData ? props.metricData.Vertical : ''
  userMetric.MetricName = props.metricData ? props.metricData.MetricName : ''
  userMetric.MinUsageInMS = props.metricData ? props.metricData.MinUsageInMS : 0
  userMetric.HighUsageMinInMS = props.metricData
    ? props.metricData.HighUsageMinInMS
    : 0
  userMetric.FailureRateInHour = props.metricData
    ? props.metricData.FailureRateInHour
    : 0
  userMetric.StudyId = props.studyid ?? CreateNewID

  userMetric.UniqueKey = props.metricData ? props.metricData.UniqueKey : ''

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
      {props.metricData && props.metricData.IsUsage ? (
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
      <Stack horizontal tokens={horizontalStackTokens}>
        <AddMetricConfigButton
          userMetric={userMetric}
          isUserMetric={props.isUserMetric}
        />
        {props.isUserMetric ? (
          <DeleteMetricConfigButton
            userMetric={userMetric}
            isUserMetric={props.isUserMetric}
          />
        ) : (
          ''
        )}
      </Stack>
    </div>
  )
}
