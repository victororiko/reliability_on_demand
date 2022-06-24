import { IComboBoxOption, Stack, Text } from '@fluentui/react'
import React from 'react'
import { PivotListItem } from './PivotListItem'

type Props = {
  selectedItems: IComboBoxOption[]
  pivotSource: string
}

export const PivotList = (props: Props) => {
  const handlePivotScope = (value: string, pivotName: string) => {
    const ourPivot = props.selectedItems.find((item) => {
      return item.text === pivotName
    })
    console.log(ourPivot)
  }

  return (
    <div>
      <Stack horizontal horizontalAlign="space-between">
        <Text variant="xLarge">Source</Text>
        <Text variant="xLarge">Pivot</Text>
        <Text variant="xLarge">Scope</Text>
      </Stack>
      {props.selectedItems.map((item) => {
        return (
          <PivotListItem
            key={item.key}
            item={item}
            pivotSource={props.pivotSource}
            callback={handlePivotScope}
          />
        )
      })}
    </div>
  )
}
