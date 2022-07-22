import { Dropdown, IDropdownOption, TooltipHost } from '@fluentui/react'
import React from 'react'
import { Pivot } from '../../models/failurecurve.model'
import { getPivotNames } from './service'

interface Props {
  pivots: Pivot[]
  selectedOptions: string[]
  callBack: any
}

export const MultiSelectPivots = (props: Props) => {
  const onChange = (
    event?: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption
  ): void => {
    if (item) {
      const updated = item.selected
        ? [...(props.selectedOptions ?? []), item.key as string]
        : props.selectedOptions?.filter((val) => {
            return val !== item.key
          })
      props.callBack(updated, props.pivots)
    }
  }

  return (
    <div>
      <TooltipHost content="Select/Deselect Pivots based on if it is part of failure curve">
        <Dropdown
          placeholder="Select Pivots"
          label="Select Pivots"
          onChange={onChange}
          multiSelect
          options={getPivotNames(props.pivots)}
          selectedKeys={props.selectedOptions}
        />
      </TooltipHost>
    </div>
  )
}
