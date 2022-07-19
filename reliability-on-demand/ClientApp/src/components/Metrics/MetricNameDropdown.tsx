import React, { FormEvent, useEffect, useState } from 'react'
import { Dropdown, IDropdownOption, Text } from '@fluentui/react'
import {
  findMetrics as findMetric,
  generateDropdownOptions,
  Metric,
} from '../../models/metric.model'
import { MetricDetails } from './MetricDetails'

interface Props {
  defaultMetrics: Metric[]
  userMetrics: Metric[]
  StudyConfigID: number
  vertical: string
  callbackDeleteMetric: any
  callbackAddMetric: any
}

export const MetricNameDropdown = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState<IDropdownOption | null>()
  const [isUserMetric, setIsUserMetric] = useState<boolean>(false)
  const [options, setOptions] = useState<IDropdownOption[]>(
    generateDropdownOptions(props.defaultMetrics, props.userMetrics)
  )
  const [defaultMetrics, setDefaultMetrics] = useState<Metric[]>(
    props.defaultMetrics
  )
  const [userMetrics, setUserMetrics] = useState<Metric[]>(props.userMetrics)
  const [metricData, setMetricData] = useState<Metric>()

  useEffect(() => {
    // reduce defautMetrics and userMetrics by vertical selected
    const reducedDefultMetrics = props.defaultMetrics.filter((item) => {
      return item.Vertical === props.vertical
    })
    const reducedUserMetrics = props.userMetrics.filter((item) => {
      return item.Vertical === props.vertical
    })

    // remove any user metrics from default metrics
    let cleanedDefaults = reducedDefultMetrics
    for (const um of reducedUserMetrics) {
      cleanedDefaults = cleanedDefaults.filter((item) => {
        return item.MetricName !== um.MetricName
      })
    }
    const cleanedUserMetrics = reducedUserMetrics // only for consistency

    // set state
    setDefaultMetrics(cleanedDefaults)
    setUserMetrics(props.userMetrics)

    // generate dropdown options
    const dropdownOptions = generateDropdownOptions(
      cleanedDefaults,
      cleanedUserMetrics
    )
    setOptions(dropdownOptions)
    setSelectedItem(null) // force reset on Metric Name dropdown
  }, [props])

  const handleChange = (
    event: FormEvent<HTMLDivElement>,
    option?: IDropdownOption<any> | undefined,
    index?: number | undefined
  ) => {
    if (option !== undefined) {
      setSelectedItem(option)
      const [ansMetric, userMetricFlag] = findMetric(
        defaultMetrics,
        userMetrics,
        option.key as string
      )
      setMetricData(ansMetric)
      setIsUserMetric(userMetricFlag)
    }
  }

  return (
    <div>
      <Text variant="xLarge">Metric Name</Text>
      <Dropdown
        options={options || []} // if options aren't generated - pass in []
        onChange={handleChange}
        placeholder="Select a Metric Config"
      />
      {selectedItem ? (
        <div>
          <MetricDetails
            metricData={metricData}
            StudyConfigID={props.StudyConfigID}
            isUserMetric={isUserMetric}
            callbackDeleteMetric={props.callbackDeleteMetric}
            callbackAddMetric={props.callbackAddMetric}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
