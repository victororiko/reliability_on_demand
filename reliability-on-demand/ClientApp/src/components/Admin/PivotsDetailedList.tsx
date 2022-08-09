import React from 'react'
import {
  DetailsList,
  TooltipHost,
  SelectionMode,
  IColumn,
  Checkbox,
  IDropdownOption,
  TextField,
} from '@fluentui/react'
import { Pivot } from '../../models/pivot.model'
import { mapPivotTableColumnValue, buildColumnArray } from './helper'

interface Props {
  data: Pivot[]
  callBack: any
}

export const PivotsDetailedList = (props: Props) => {
  const renderItemColumn = (
    item: IDropdownOption,
    index?: number,
    column?: IColumn
  ) => {
    const fieldContent = item[
      column?.fieldName as keyof IDropdownOption
    ] as string

    if (
      column?.key === 'PivotName' ||
      column?.key === 'ADLDataType' ||
      column?.key === 'UIDataType'
    ) {
      return <span>{fieldContent}</span>
    }

    if (
      column?.key === 'IsSelectColumn' ||
      column?.key === 'IsKeyColumn' ||
      column?.key === 'IsApportionColumn' ||
      column?.key === 'IsApportionJoinColumn' ||
      column?.key === 'IsScopeFilter' ||
      column?.key === 'AggregateBy'
    ) {
      return (
        <span>
          <Checkbox
            checked={Boolean(fieldContent ?? false)}
            id={`${index}_${column?.key}`}
            onChange={onCheckboxChange}
          />
        </span>
      )
    }

    if (column?.key === 'PivotExpression') {
      return (
        <span>
          <TextField
            value={fieldContent}
            id={`${index}_${column?.key}`}
            onChange={onTextboxChange}
          />
        </span>
      )
    }
    return <span />
  }

  const onTextboxChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    const target = event?.target as HTMLInputElement
    const arr = target.id.toString().split('_')
    const row = Number(arr[0])
    const col = arr[1]
    props.callBack(mapPivotTableColumnValue(props.data, row, col, newValue))
  }

  const onCheckboxChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    isChecked?: boolean
  ) => {
    const target = ev?.target as HTMLInputElement
    const arr = target.id.toString().split('_')
    const row = Number(arr[0])
    const col = arr[1]

    props.callBack(
      mapPivotTableColumnValue(props.data, row, col, target.checked)
    )
  }

  return (
    <div>
      <TooltipHost content="Select/Deselect what kind of Pivot it is in the Watson call">
        <DetailsList
          items={props.data}
          setKey="set"
          columns={buildColumnArray(props.data)}
          onRenderItemColumn={renderItemColumn}
          selectionMode={SelectionMode.none}
        />
      </TooltipHost>
    </div>
  )
}
