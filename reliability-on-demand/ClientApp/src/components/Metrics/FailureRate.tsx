import { Stack, Text } from '@fluentui/react'
import React, { useEffect, useState } from 'react'
import { Metric } from '../../models/metric.model'
import { containerStackTokens, horizontalStackTokens } from '../helpers/Styles'
import { myParseInt } from '../helpers/utils'
import { FailureRateCalculated } from './FailureRateCalculated'
import { SpinButtonHour } from './SpinButtonHour'

interface Props {
  metricData: Metric | undefined
  callback: any
}

export const FailureRate = (props: Props) => {
  const [mttf, setMttf] = useState<string>('8')
  const [failureRate, setFailureRate] = useState<string>('0.125')

  useEffect(() => {
    props.metricData
      ? setFailureRate(props.metricData.FailureRateInHour.toString())
      : setFailureRate('0.125')

    props.metricData
      ? setMttf(Math.round(1 / props.metricData.FailureRateInHour).toString())
      : setMttf('8')
  }, [props])

  const updateMttf = (value: string) => {
    const floatValue = parseFloat(value)
    const mttfHours = 1 / floatValue
    const rounded = Math.floor(mttfHours)
    setMttf(rounded.toString())
    setFailureRate(value)
    props.callback(floatValue)
  }

  const updateFailureRate = (value: string) => {
    const hours = myParseInt(value)
    const rate = 1 / hours
    setFailureRate(rate.toString())
    setMttf(value)
    props.callback(rate)
  }

  return (
    <Stack tokens={containerStackTokens}>
      <Text variant="xLarge">Failure Rate</Text>

      <Text variant="large">
        MTTF (Mean Time To Failure) Threshold in Hours
      </Text>
      <Stack horizontal tokens={horizontalStackTokens}>
        <SpinButtonHour mttfHoursStr={mttf} callback={updateFailureRate} />

        <FailureRateCalculated
          failureRateStr={failureRate}
          callback={updateMttf}
        />
      </Stack>
    </Stack>
  )
}
