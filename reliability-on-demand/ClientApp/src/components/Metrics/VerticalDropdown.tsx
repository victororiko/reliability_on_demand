import React, { FormEvent } from 'react'
import { Dropdown, IDropdownOption, Text } from '@fluentui/react'
import { getDistinctVerticals, Metric } from './model'
import { convertSimpleTypeToOptions } from '../helpers/utils'
import { MetricNameDropdown } from './MetricNameDropdown'

interface Props {
  metricData: Metric[]
  studyid: number
}

export const VerticalDropdown = (props: Props) => {
  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>({
    key: 0,
    text: props.metricData[0].Vertical,
  })
  const onChange = (
    event: FormEvent<HTMLDivElement>,
    option: IDropdownOption<any> | undefined,
    index?: number | undefined
  ) => {
    if (option === undefined) {
      setSelectedItem({ key: -1, text: 'not a valid option' })
    } else setSelectedItem(option)
  }

  return (
    <div>
      <Text variant="xLarge">Vertical</Text>
      <Dropdown
        options={convertSimpleTypeToOptions(
          getDistinctVerticals(props.metricData),
          true
        )}
        selectedKey={selectedItem ? selectedItem.key : 0}
        onChange={onChange}
      />
      <MetricNameDropdown
        metricData={props.metricData.filter((item) => {
          return item.Vertical === selectedItem?.text
        })}
        studyid={props.studyid}
      />
    </div>
  )
}
