import React from 'react'
import {
  DetailsList,
  TooltipHost,
  SelectionMode,
  IColumn,
  Checkbox,
} from '@fluentui/react'
import { Pair, PivotTable } from '../../models/failurecurve.model'
import { buildColumnArray, mapPivotTableColumnValue } from './service'

interface Props {
  data: PivotTable[]
  callBack: any
}

export const PivotsDetailedList = (props: Props) => {
  const renderItemColumn = (item: Pair, index?: number, column?: IColumn) => {
    const fieldContent = item[column?.fieldName as keyof Pair] as string

    if (column?.key === 'PivotID') return <span />
    if (column?.key !== 'PivotName') {
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
    return <span>{fieldContent}</span>
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
