import React, { FormEvent, useState } from 'react'
import { Dropdown, IDropdownOption, Text } from '@fluentui/react'
import { getDistinctMetricNames, Metric } from './model'
import { convertSimpleTypeToOptions } from '../helpers/utils'
import { MetricDetails } from './MetricDetails'

interface Props {
  metricData: Metric[]
  studyid: number
}

export const MetricNameDropdown = (props: Props) => {
  // initialize dropdown with first metric name
  const [selectedItem, setSelectedItem] = useState<IDropdownOption>({
    key: 0,
    text: props.metricData[0].MetricName,
  })
  const onChange = (
    event: FormEvent<HTMLDivElement>,
    option?: IDropdownOption<any> | undefined,
    index?: number | undefined
  ) => {
    if (option !== undefined) setSelectedItem(option)
  }
  return (
    <div>
      <Text variant="xLarge">Metric Name</Text>
      <Dropdown
        options={convertSimpleTypeToOptions(
          getDistinctMetricNames(props.metricData),
          true
        )}
        selectedKey={selectedItem ? selectedItem.key : undefined}
        onChange={onChange}
      />
      <MetricDetails
        metricData={props.metricData.filter((item) => {
          return item.MetricName === selectedItem?.text
        })}
        studyid={props.studyid}
      />
    </div>
  )
}
