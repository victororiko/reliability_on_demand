import { Stack } from '@fluentui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Metric } from '../../models/metric.model'
import { Loading } from '../helpers/Loading'
import { CreateNewID } from '../helpers/utils'
import { VerticalDropdown } from './VerticalDropdown'

interface Props {
  StudyConfigID: number
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
  // reload component whenever study
  useEffect(() => {
    loadMetrics(props.StudyConfigID)
  }, [props.StudyConfigID])

  // loading metrics piece is here because axios
  // internals require you to setState -- not return a value
  const loadMetrics = async (StudyConfigID: number = CreateNewID) => {
    setLoading(true)
    try {
      // get defaults from backend
      const response = await axios.get(
        `api/Data/GetDefaultMetricsConfig/${StudyConfigID}`
      )
      let defaultsFromBackend: Metric[] = []
      if (response && response.data !== '')
        defaultsFromBackend = response.data as Metric[]
      // get user metrics from backend
      const response2 = await axios.get(
        `api/Data/GetMetricConfigs/${StudyConfigID}`
      )

      // check if any user metrics exist in default - remove those from defaults
      if (response2.data === '') setUserMetrics([])
      else {
        const userMetricsFromBackend = response2.data as Metric[]
        setUserMetrics(userMetricsFromBackend)
      }
      setDefaults(defaultsFromBackend)
      setLoading(false)
    } catch (exception) {
      console.error(exception)
    }
  }

  const handleCallbackDeleteMetric = () => {
    loadMetrics(props.StudyConfigID)
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
            StudyConfigID={props.StudyConfigID}
            callbackDeleteMetric={handleCallbackDeleteMetric}
            callbackAddMetric={handleCallbackDeleteMetric}
          />
        </Stack>
      )}
    </div>
  )
}
