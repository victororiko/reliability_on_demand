import { Stack } from '@fluentui/react'
import React, { useEffect, useState } from 'react'
import { SpinButtonMins } from './SpinButtonMins'
import { SpinButtonSec } from './SpinButtonSec'
import { horizontalStackTokens } from '../helpers/Styles'
import { Metric } from './model'

interface Props {
  title: string
  metricData: Metric[]
  callback: any
}

export const HighUsageMinimum = (props: Props) => {
  const [timeInSec, setTimeInSec] = useState(0)
  const [timeInMin, setTimeInMin] = useState(0)
  const oneMinInMS = 60000
  const oneSecInMS = 60

  useEffect(() => {
    const minUsageMS =
      props.metricData.length > 0 ? props.metricData[0].HighUsageMinInMS : 0

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
    const seconds = parseInt(value, 10)
    setTimeInSec(seconds)
  }
  const addMinutes = (value: string) => {
    const minutes = parseInt(value, 10)
    setTimeInMin(minutes)
  }

  const prepUsageInMS = timeInSec * 1000 + timeInMin * 60000
  props.callback(prepUsageInMS)

  const scrubbed = (usage: number): string => {
    if (usage >= 9223372036854729000) return 'N/A'
    return `${usage.toString()} ms`
  }

  return (
    <Stack>
      {props.title} = {scrubbed(prepUsageInMS)}
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
