import React, { useEffect, useState } from 'react'
import { Stack } from '@fluentui/react'
import axios from 'axios'
import { VerticalDropdown } from './VerticalDropdown'
import { Metric } from './model'
import { Loading } from '../helpers/Loading'
import { CreateNewID } from '../helpers/utils'

interface Props {
  studyid: number
  verticalList: string[]
}

/**
 * Primary responsibility: layout of sub components and loading defaults
 * @param props Study to populate the metrics for
 * @returns Component that allows user to generate a metric for their Study
 */
export const Metrics = (props: Props) => {
  const [defaults, setDefaults] = useState<Metric[]>([])
  const [loading, setLoading] = useState(true)
  const [userMetrics, setUserMetrics] = useState<Metric[]>([])
  // reload component whenever study or vertical changes
  useEffect(() => {
    loadMetrics(props.verticalList, props.studyid)
  }, [props.verticalList, props.studyid])

  // loading metrics pieces is here because axios
  // internals require you to setState -- not return a value
  const loadMetrics = async (
    verticalList: string[],
    studyid: number = CreateNewID
  ) => {
    try {
      console.debug(
        `verticals list passed in = ${JSON.stringify(verticalList)}`
      )
      const response = await axios.get(`api/Data/GetDefaultMetricsConfig/`)
      let defaultsFromBackend = response.data as Metric[]
      const response2 = await axios.get(`api/Data/GetMetricConfigs/${studyid}`)
      if (response2.data === '') {
        setUserMetrics([])
      } else {
        const userMetricsFromBackend = response2.data as Metric[]
        setUserMetrics(userMetricsFromBackend)
        for (const um of userMetricsFromBackend) {
          // um = user metric
          defaultsFromBackend = defaultsFromBackend.filter(
            (item) => {return item.MetricName !== um.MetricName}
          )
        }
      }
      setDefaults(defaultsFromBackend)
    } catch (exception) {
      console.error(exception)
    }
    setLoading(false)
  }

  return (
    <div>
      {loading ? (
        <Loading message="Getting Default Metrics - hang tight" />
      ) : (
        <Stack>
          <h1>Metrics Section</h1>
          <VerticalDropdown
            defaultMetrics={defaults}
            userMetrics={userMetrics}
            studyid={props.studyid}
          />
        </Stack>
      )}
    </div>
  )
}
