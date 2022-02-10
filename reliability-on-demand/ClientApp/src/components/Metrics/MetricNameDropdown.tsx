import React, { FormEvent } from 'react'
import { Dropdown, IDropdownOption, Text } from '@fluentui/react'
import { getDistinctMetricNames, Metric } from './model'
import { convertSimpleTypeToOptions } from '../helpers/utils'
import { MetricDetails } from './MetricDetails'

type Props = {
  metricData: Metric[]
  studyid: number
}

export const MetricNameDropdown = (props: Props) => {
  const [selectedItem, setSelectedItem] = React.useState<
    IDropdownOption | undefined
  >(
    props.metricData.length > 0
      ? {
          key: 0,
          text: props.metricData[0].MetricName,
        }
      : {
          key: 0,
          text: '',
        }
  )
  const onChange = (
    event: FormEvent<HTMLDivElement>,
    option?: IDropdownOption<any> | undefined,
    index?: number | undefined
  ) => {
    setSelectedItem(option)
  }
  return (
    <div>
      <Text variant="xLarge">Metric Name</Text>
      <Dropdown
        options={convertSimpleTypeToOptions(
          getDistinctMetricNames(props.metricData),
          true
        )}
        selectedKey={selectedItem ? selectedItem.key : 0}
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
