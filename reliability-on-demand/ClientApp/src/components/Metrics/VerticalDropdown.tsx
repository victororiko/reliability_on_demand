import React, { FormEvent } from 'react'
import { Dropdown, IDropdownOption, Text } from '@fluentui/react'
import { getDistinctVerticals, Metric } from '../../models/metric.model'
import { convertSimpleTypeToOptions } from '../helpers/utils'
import { MetricNameDropdown } from './MetricNameDropdown'

interface Props {
  defaultMetrics: Metric[]
  userMetrics: Metric[]
  studyid: number
}

export const VerticalDropdown = (props: Props) => {
  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>()
  const onChange = (
    event: FormEvent<HTMLDivElement>,
    option: IDropdownOption<any> | undefined,
    index?: number | undefined
  ) => {
    if (option !== undefined) setSelectedItem(option)
  }

  return (
    <div>
      <Text variant="xLarge">Vertical</Text>
      <Dropdown
        options={convertSimpleTypeToOptions(
          getDistinctVerticals(props.defaultMetrics),
          true
        )}
        onChange={onChange}
        placeholder="Select a Vertical"
      />
      {selectedItem ? (
        <MetricNameDropdown
          defaultMetrics={props.defaultMetrics.filter((item) => {
            return item.Vertical === selectedItem?.text
          })}
          userMetrics={props.userMetrics}
          studyid={props.studyid}
        />
      ) : (
        ''
      )}
    </div>
  )
}
