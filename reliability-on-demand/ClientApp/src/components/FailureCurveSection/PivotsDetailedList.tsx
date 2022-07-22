import React from 'react'
import {
  DetailsList,
  TooltipHost,
  SelectionMode,
  IColumn,
  Checkbox,
  IDropdownOption,
} from '@fluentui/react'
import { Pivot } from '../../models/failurecurve.model'
import { buildColumnArray, mapPivotTableColumnValue } from './service'

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
      column?.key === 'IsSelectPivot' ||
      column?.key === 'IsKeyPivot' ||
      column?.key === 'IsApportionPivot' ||
      column?.key === 'IsApportionJoinPivot' ||
      column?.key === 'IsScopeFilter'
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

    if (column?.key === 'PivotSourceColumnName') {
      return <span>{fieldContent}</span>
    }
    return <span />
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
