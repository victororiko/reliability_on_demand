import { Stack } from '@fluentui/react'
import React, { useEffect, useState } from 'react'
import { Metric } from '../../models/metric.model'
import { horizontalStackTokens } from '../helpers/Styles'
import { myParseInt, prepUsageInMS } from '../helpers/utils'
import { SpinButtonMins } from './SpinButtonMins'
import { SpinButtonSec } from './SpinButtonSec'

interface Props {
  title: string
  metricData: Metric | undefined
  callback: any
}

export const LowUsageMinimum = (props: Props) => {
  const [timeInSec, setTimeInSec] = useState(0)
  const [timeInMin, setTimeInMin] = useState(0)
  const oneMinInMS = 60000
  const oneSecInMS = 60

  useEffect(() => {
    const minUsageMS = props.metricData ? props.metricData.MinUsageInMS : 0

    // CORE LOGIC: parse MS to individual mins and seconds
    if (minUsageMS % oneMinInMS === 0) {
      setTimeInMin(Math.floor(minUsageMS / oneMinInMS))
      setTimeInSec(0)
    } else {
      setTimeInMin(Math.floor(minUsageMS / oneMinInMS))
      setTimeInSec(minUsageMS % oneSecInMS)
    }
  }, [props.metricData])

  const addSeconds = (value: string) => {
    const seconds = myParseInt(value)
    setTimeInSec(seconds)
  }
  const addMinutes = (value: string) => {
    const minutes = myParseInt(value)
    setTimeInMin(minutes)
  }

  const totalUsageInMS = prepUsageInMS(timeInSec, timeInMin)
  props.callback(totalUsageInMS)
  const usageInMS = totalUsageInMS.toString()

  return (
    <Stack>
      {props.title} = {usageInMS.toString()} ms
      <Stack horizontal tokens={horizontalStackTokens}>
        <SpinButtonMins
          callback={addMinutes}
          defaultMins={timeInMin.toString()}
        />
        <SpinButtonSec
          callback={addSeconds}
          defaultSecs={timeInSec.toString()}
        />
      </Stack>
    </Stack>
  )
}
