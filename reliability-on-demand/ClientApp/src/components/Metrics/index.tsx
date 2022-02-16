import React, { useEffect, useState } from 'react'
import { Stack } from '@fluentui/react'
import axios from 'axios'
import { VerticalDropdown } from './VerticalDropdown'
import { Metric } from './model'
import { Loading } from '../helpers/Loading'

interface Props {
  studyid: number
}

/**
 * Primary responsibility: layout of sub components and loading defaults
 * @param props Study to populate the metrics for
 * @returns Component that allows user to generate a metric for their Study
 */
export const Metrics = (props: Props) => {
  const [defaults, setDefaults] = useState<Metric[]>([])
  const [loading, setLoading] = useState(true)
  // mount component
  useEffect(() => {
    loadMetrics()
  }, [])

  // loading metrics pieces is here because axios
  // internals require you to setState -- not return a value
  const loadMetrics = () => {
    // eslint-disable-next-line prefer-const
    axios.get(`api/Data/GetDefaultMetricsConfig`).then((res) => {
      if (res.data) {
        setDefaults(res.data)
        setLoading(false)
      } else {
        console.debug('No metrics found. Showing Hardcoded values')
      }
    })
  }

  return (
    <div>
      {loading ? (
        <Loading message="Getting Default Metrics - hang tight" />
      ) : (
        <Stack>
          <h1>Metrics Section</h1>
          <VerticalDropdown metricData={defaults} studyid={props.studyid} />
        </Stack>
      )}
    </div>
  )
}
