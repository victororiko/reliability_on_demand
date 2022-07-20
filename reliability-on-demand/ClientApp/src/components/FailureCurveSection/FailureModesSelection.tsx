import { Dropdown, IDropdownOption, TooltipHost } from '@fluentui/react'
import React from 'react'

interface Props {
  modes: IDropdownOption[]
  select: string
  callBack: any
}

export const FailureModesSelection = (props: Props) => {
  const onChange = (
    event: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption,
    index?: number
  ): void => {
    if (item) {
      if (item.key === 'Select Mode') return
      const p: IDropdownOption = { key: item.key.toString(), text: item.text }
      props.callBack(p.key, true)
    }
  }

  return (
    <div>
      <TooltipHost content="Select the vertical to configure from the selected list">
        <Dropdown
          label="Select Failure Mode"
          placeholder="Select Mode"
          selectedKey={props.select}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={onChange}
          options={props.modes}
        />
      </TooltipHost>
    </div>
  )
}
