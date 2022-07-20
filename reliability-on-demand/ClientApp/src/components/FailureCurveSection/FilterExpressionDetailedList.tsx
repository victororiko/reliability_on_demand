import {
  DefaultButton,
  DetailsList,
  Dropdown,
  IColumn,
  IDropdownOption,
  SelectionMode,
  TextField,
  TooltipHost,
} from '@fluentui/react'
import React from 'react'
import { FilterExpTable } from '../../models/failurecurve.model'
import './FailureCurveSection.css'
import {
  FilterExpressionbuildColumnArray,
  getPivotID,
  loadOperators,
  loadRelationalOperators,
  mapFilterExpTableColumnValue,
} from './service'

interface Props {
  filterExpTable: FilterExpTable[]
  filterExpPivots: IDropdownOption[]
  callBack: any
}

export const FilterExpressionDetailedList = (props: Props) => {
  // state
  const [pivotValuePlaceholder, setPivotValuePlaceholder] =
    React.useState<string>('')
  const [changedFilterExp, setChangedFilterExp] = React.useState<
    FilterExpTable[]
  >(props.filterExpTable)
  const [cols, setCols] = React.useState<IColumn[]>(
    FilterExpressionbuildColumnArray(props.filterExpTable)
  )

  const addClicked = (id: any) => {
    const item: FilterExpTable = {
      PivotID: 0,
      PivotName: '',
      PivotValue: '',
      PivotScopeID: 0,
      Operator: '',
      RelationalOperator: '',
      UIInputDataType: '',
      PivotKey: '',
    }

    const updated = [
      ...changedFilterExp.slice(0, id),
      item,
      ...changedFilterExp.slice(id),
    ]

    setChangedFilterExp(updated)
    setCols([])
    setCols(FilterExpressionbuildColumnArray(changedFilterExp))
    props.callBack(updated)
  }

  const deleteClicked = (id: any) => {
    const updated = []

    for (let i = 0; i < changedFilterExp.length; i++) {
      if (i !== id) {
        updated.push(changedFilterExp[i])
      }
    }

    setChangedFilterExp(updated)
    setCols([])
    setCols(FilterExpressionbuildColumnArray(changedFilterExp))
    props.callBack(updated)
  }

  const onPivotSelected = (
    event: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption
  ): void => {
    if (item) {
      const target = event?.target as HTMLInputElement
      const arr = target.id.toString().split('_')
      const row = Number(arr[0])
      const col = arr[1]
      let updated = mapFilterExpTableColumnValue(
        changedFilterExp,
        row,
        col,
        item.text
      )

      updated = mapFilterExpTableColumnValue(updated, row, 'PivotID', item.key)

      for (const ele of changedFilterExp) {
        if (ele.PivotID === item.key && ele.UIInputDataType !== '') {
          setPivotValuePlaceholder(ele.UIInputDataType)
          break
        }
      }
      setChangedFilterExp(updated)
      setCols([])
      setCols(FilterExpressionbuildColumnArray(changedFilterExp))
      props.callBack(updated)
    }
  }

  const onOperatorSelected = (
    event: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption
  ): void => {
    if (item) {
      const target = event?.target as HTMLInputElement
      const arr = target.id.toString().split('_')
      const row = Number(arr[0])
      const col = arr[1]
      const updated = mapFilterExpTableColumnValue(
        changedFilterExp,
        row,
        col,
        item.text
      )
      setChangedFilterExp(updated)
      setCols([])
      setCols(FilterExpressionbuildColumnArray(changedFilterExp))
      props.callBack(updated)
    }
  }

  const onRelationalOperatorSelected = (
    event: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption
  ): void => {
    if (item) {
      const target = event?.target as HTMLInputElement
      const arr = target.id.toString().split('_')
      const row = Number(arr[0])
      const col = arr[1]
      const updated = mapFilterExpTableColumnValue(
        changedFilterExp,
        row,
        col,
        item.text
      )
      setChangedFilterExp(updated)
      setCols([])
      setCols(FilterExpressionbuildColumnArray(changedFilterExp))
      props.callBack(updated)
    }
  }

  const onTextBoxChange = (event: {}): void => {
    const e = event as React.ChangeEvent<HTMLInputElement>
    const target = e?.target as HTMLInputElement
    const arr = target.id.toString().split('_')

    const row = Number(arr[0])
    const col = arr[1]

    const updated = mapFilterExpTableColumnValue(
      changedFilterExp,
      row,
      col,
      e.target.value
    )
    setChangedFilterExp(updated)
    setCols([])
    setCols(FilterExpressionbuildColumnArray(changedFilterExp))
    props.callBack(updated)
  }

  React.useEffect(() => {
    setCols([])
    setCols(FilterExpressionbuildColumnArray(changedFilterExp))
  }, [props.filterExpPivots, props.filterExpTable, changedFilterExp])

  const renderItemColumn = (
    item: IDropdownOption,
    index?: number,
    column?: IColumn
  ) => {
    const fieldContent = item[
      column?.fieldName as keyof IDropdownOption
    ] as string

    if (column?.key === 'Add/Delete') {
      return (
        <span>
          <DefaultButton
            text="+"
            onClick={() => {
              return addClicked(index)
            }}
            id={index?.toString()}
            allowDisabledFocus
            disabled={false}
            checked={false}
            className="Button"
          />
          <DefaultButton
            text="X"
            onClick={() => {
              return deleteClicked(index)
            }}
            id={index?.toString()}
            allowDisabledFocus
            disabled={false}
            checked={false}
            className="Button"
          />
        </span>
      )
    }
    if (column?.key === 'PivotName') {
      const val = { fieldContent }
      const key = getPivotID(val, changedFilterExp)

      return (
        <span>
          <Dropdown
            selectedKey={key}
            onChange={onPivotSelected}
            options={props.filterExpPivots}
            id={`${index}_${column?.name}`}
          />
        </span>
      )
    }
    if (column?.key === 'Operator') {
      return (
        <span>
          <Dropdown
            selectedKey={fieldContent}
            onChange={onOperatorSelected}
            options={loadOperators()}
            id={`${index}_${column?.name}`}
          />
        </span>
      )
    }
    if (column?.key === 'RelationalOperator') {
      return (
        <span>
          <Dropdown
            selectedKey={fieldContent}
            onChange={onRelationalOperatorSelected}
            options={loadRelationalOperators()}
            id={`${index}_${column?.name}`}
          />
        </span>
      )
    }
    return (
      <span>
        <TextField
          value={fieldContent}
          id={`${index}_${column?.name}`}
          onChange={onTextBoxChange}
          placeholder={pivotValuePlaceholder}
        />
      </span>
    )
  }

  return (
    <div>
      <TooltipHost content="Select/Deselect what kind of Pivot it is in the Watson call">
        <DetailsList
          items={changedFilterExp}
          setKey="set"
          columns={cols}
          onRenderItemColumn={renderItemColumn}
          selectionMode={SelectionMode.none}
        />
      </TooltipHost>
    </div>
  )
}
