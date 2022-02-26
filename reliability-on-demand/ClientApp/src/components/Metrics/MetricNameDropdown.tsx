import React, { FormEvent, useEffect, useState } from 'react'
import { Dropdown, IDropdownOption, Text } from '@fluentui/react'
import {
  findMetrics as findMetric,
  generateDropdownOptions,
  Metric,
} from './model'
import { MetricDetails } from './MetricDetails'
import { MessageBox } from '../helpers/MessageBox'

interface Props {
  defaultMetrics: Metric[]
  userMetrics: Metric[]
  studyid: number
}

export const MetricNameDropdown = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState<IDropdownOption>()
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
    setDefaultMetrics(props.defaultMetrics)
    setUserMetrics(props.userMetrics)
    const dropdownOptions = generateDropdownOptions(defaultMetrics, userMetrics)
    setOptions(dropdownOptions)
  }, [props.defaultMetrics, props.userMetrics])

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
            studyid={props.studyid}
            isUserMetric={isUserMetric}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
