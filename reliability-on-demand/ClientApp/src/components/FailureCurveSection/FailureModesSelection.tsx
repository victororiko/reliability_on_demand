import React from 'react'
import { Dropdown, IDropdownOption, TooltipHost } from '@fluentui/react'
import { Pair } from '../../models/failurecurve.model'

interface Props {
  modes: Pair[]
  callBack: any
}

export const FailureModesSelection = (props: Props) => {
  // state
  const [selectedItem, setselectedItem] = React.useState<Pair>()

  const onChange = (
    event: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption,
    index?: number
  ): void => {
    if (item) {
      if (item.key === 'Select Mode') return
      const p: Pair = { key: item.key.toString(), text: item.text }
      setselectedItem(p)
      props.callBack(p.key)
    }
  }

  return (
    <div>
      <TooltipHost content="Select the vertical to configure from the selected list">
        <Dropdown
          label="Select Failure Mode"
          placeholder="Select Mode"
          selectedKey={selectedItem?.key}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={onChange}
          options={props.modes}
        />
      </TooltipHost>
    </div>
  )
}
