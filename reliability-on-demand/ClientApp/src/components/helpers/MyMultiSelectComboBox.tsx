import * as React from 'react'
import { ComboBox, IComboBoxOption, SelectableOptionMenuItemType, IComboBox } from '@fluentui/react'
const INITIAL_OPTIONS: IComboBoxOption[] = [
  { key: 'Header1', text: 'First heading', itemType: SelectableOptionMenuItemType.Header },
  { key: 'A', text: 'Option A' },
  { key: 'B', text: 'Option B' },
  { key: 'C', text: 'Option C' },
  { key: 'D', text: 'Option D' },
  { key: 'divider', text: '-', itemType: SelectableOptionMenuItemType.Divider },
  { key: 'Header2', text: 'Second heading', itemType: SelectableOptionMenuItemType.Header },
  { key: 'E', text: 'Option E' },
  { key: 'F', text: 'Option F', disabled: true },
  { key: 'G', text: 'Option G' },
  { key: 'H', text: 'Option H' },
  { key: 'I', text: 'Option I' },
  { key: 'J', text: 'Option J' },
]
// Optional styling to make the example look nicer

/**
 * @param data array of <Key,Text> pairs
 * @param callBack Function that should be called by this (child) component back to your (parent) component
 */
interface Props {
  data: any
  callBack: any
}

export const MyMultiSelectComboBox = (props: Props) => {
  // start with no selected keys - this forces the user to make a selection
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([])
  // if data passed in use it, otherwise use the options specified in this file
  const [options] = React.useState(props.data ?? INITIAL_OPTIONS)

  // this method is called a lot. React.useCallback() --> returns a memoized function that is called only when [selectedKeys] is changed
  const onChange = React.useCallback(
    (
      event: React.FormEvent<IComboBox>,
      option?: IComboBoxOption,
      index?: number,
      value?: string
    ): void => {
      let selected = option?.selected

      if (option) {
        setSelectedKeys((prevSelectedKeys) =>
          selected
            ? [...prevSelectedKeys, option!.key as string]
            : prevSelectedKeys.filter((k) => k !== option!.key)
        )
      }
    },
    [selectedKeys]
  )

  return (
    <ComboBox
      multiSelect
      selectedKey={selectedKeys}
      label="Controlled multi-select ComboBox"
      allowFreeform
      options={options}
      onChange={onChange}
      onItemClick={props.callBack(selectedKeys)}
    />
  )
}
