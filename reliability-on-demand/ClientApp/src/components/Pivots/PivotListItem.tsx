import { IComboBoxOption, Text, Stack, TextField } from '@fluentui/react'
import React from 'react'
import { horizontalStackTokens } from '../helpers/Styles'

type Props = {
  item: IComboBoxOption
  pivotSource: string
  callback: any
}

export const PivotListItem = (props: Props) => {
  const [pivotScopeValue, setPivotScopeValue] = React.useState('')

  const onChangeFirstTextFieldValue = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setPivotScopeValue(newValue || '')
      const pivotName = props.item.text
      props.callback(newValue || '', pivotName)
    },
    []
  )

  return (
    <div>
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={horizontalStackTokens}
      >
        <Text variant="mediumPlus">{props.pivotSource}</Text>
        <Text variant="mediumPlus">{props.item.text}</Text>
        <TextField
          value={pivotScopeValue}
          onChange={onChangeFirstTextFieldValue}
        />
      </Stack>
    </div>
  )
}
