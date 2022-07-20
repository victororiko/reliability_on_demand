import { Dropdown, IDropdownOption, Text } from '@fluentui/react'
import React, { FormEvent, useEffect } from 'react'
import { getDistinctVerticals, Metric } from '../../models/metric.model'
import { convertSimpleTypeToOptions } from '../helpers/utils'
import { MetricNameDropdown } from './MetricNameDropdown'

interface Props {
  defaultMetrics: Metric[]
  userMetrics: Metric[]
  StudyConfigID: number
  callbackDeleteMetric: any
  callbackAddMetric: any
}

export const VerticalDropdown = (props: Props) => {
  const [selectedItem, setSelectedItem] = React.useState<
    IDropdownOption | undefined
  >(undefined)

  // force blank for rest of the UI
  useEffect(() => {
    setSelectedItem(undefined)
  }, [props])

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
          defaultMetrics={props.defaultMetrics}
          userMetrics={props.userMetrics}
          StudyConfigID={props.StudyConfigID}
          vertical={selectedItem.text}
          callbackDeleteMetric={props.callbackDeleteMetric}
          callbackAddMetric={props.callbackAddMetric}
        />
      ) : (
        ''
      )}
    </div>
  )
}
