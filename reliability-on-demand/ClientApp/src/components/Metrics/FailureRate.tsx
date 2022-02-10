import React, { useEffect, useState } from 'react'
import { Stack, Text } from '@fluentui/react'
import { SpinButtonHour } from './SpinButtonHour'
import { FailureRateCalculated } from './FailureRateCalculated'
import { containerStackTokens, horizontalStackTokens } from '../helpers/Styles'
import { Metric } from './model'

interface Props {
  metricData: Metric[]
  callback: any
}

export const FailureRate = (props: Props) => {
  const [mttf, setMttf] = useState<string>('8')
  const [failureRate, setFailureRate] = useState<string>('0.125')

  useEffect(() => {
    setFailureRate(props.metricData[0].FailureRateInHour.toString())
    setMttf(Math.round(1 / props.metricData[0].FailureRateInHour).toString())
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
    const hours = parseInt(value, 10)
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
