import axios from 'axios'
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
import { StudyPivotConfig } from '../../../models/filterexpression.model'
import './FailureCurveSection.css'
import {
  FilterExpressionbuildColumnArray,
  getPivotScopeIDs,
  loadOperators,
  loadRelationalOperators,
  mapFilterExpTableColumnValue,
  getPivotKey,
  getAllFilteredPivots,
} from './service'

/**
 * Responsibilities : The filter expression component takes in the array of StudyPivotConfig and queries the backend to fetch the filter expression from the RELPivotScope table to show it to the user.
 * Returns an array of StudyPivotConfig
 * Param : StudyPivotConfigs-> array of StudyPivotConfig that are currently configured pivot scope ids or null in case the user wants to configure a new pivot as filter expression
 * Param : callBack -> Return array of StudyPivotConfig that takes 2 arguments -> array of StudyPivotConfig and boolean argument to tell if need to call backend or not
 * Param: callBackend -> decide to call the backend or not. It should be true for the first time to load the already configured or default filter expression.
 * After that, it will be false if it is not explicitly set by the callee.
 * */
interface Props {
  studyPivotConfigs: StudyPivotConfig[] // Currently configured pivotscope ids or null in case user wants to configure a new pivot as filter expression
  callBack: any // Return array of StudyPivotConfig that takes 2 arguments -> array of StudyPivotConfig and boolean argument to tell if need to call backend or not
  callBackend: boolean // Should be false in all the cases where you don't want to reset the filter expression component by reloading the configured filter expression again.
}

// only type used for input/output is RELStudyPivotConfig
export const FilterExpressionDetailedList = (props: Props) => {
  // state
  const [pivotValuePlaceholder, setPivotValuePlaceholder] =
    React.useState<string>('')
  const [cols, setCols] = React.useState<IColumn[]>([])
  const [selectedPivotsKeys, setSelectedPivotKeys] = React.useState<
    IDropdownOption[]
  >([])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [changedFilterExp, setChangedFilterExp] = React.useState<
    StudyPivotConfig[]
  >([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPivotScopeInfo = (input: StudyPivotConfig[]) => {
    //

    if (
      props.studyPivotConfigs === null ||
      props.studyPivotConfigs.length === 0
    ) {
      setSelectedPivotKeys([])
      setChangedFilterExp([])
    } else if (props.callBackend === false) {
      setChangedFilterExp(input)
    } else {
      setSelectedPivotKeys(getAllFilteredPivots(props.studyPivotConfigs))
      const studyconfigidWithScopes = getPivotScopeIDs(input)
      axios
        .post(
          'api/Data/GetFilterExpressionForPivotScopeIds',
          studyconfigidWithScopes
        )
        .then((response) => {
          if (response.data !== null && response.data !== '') {
            setChangedFilterExp(response.data)
          } else {
            const row: StudyPivotConfig = {
              PivotKey: '',
              PivotScopeID: -1,
              PivotOperator: '',
              PivotScopeValue: '',
              StudyConfigID: props.studyPivotConfigs[0].StudyConfigID,
              RelationalOperator: '',
              UIDataType: '',
              PivotName: '',
            }

            const arr: StudyPivotConfig[] = []
            arr.push(row)
            setChangedFilterExp(arr)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const addClicked = (id: any) => {
    const item: StudyPivotConfig = {
      PivotKey: '',
      PivotScopeID: -1,
      PivotOperator: '',
      PivotScopeValue: '',
      StudyConfigID: props.studyPivotConfigs[0].StudyConfigID,
      RelationalOperator: '',
      UIDataType: '',
      PivotName: '',
    }

    const updated = [
      ...changedFilterExp.slice(0, id),
      item,
      ...changedFilterExp.slice(id),
    ]

    setChangedFilterExp(updated)
    setCols([])
    setCols(FilterExpressionbuildColumnArray(changedFilterExp))
    props.callBack(updated, false)
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
    props.callBack(updated, false)
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

      updated = mapFilterExpTableColumnValue(updated, row, 'PivotKey', item.key)

      for (const ele of changedFilterExp) {
        if (ele.PivotKey === item.key && ele.UIDataType !== '') {
          setPivotValuePlaceholder(ele.UIDataType ?? '')
          break
        }
      }
      setChangedFilterExp(updated)
      setCols([])
      setCols(FilterExpressionbuildColumnArray(changedFilterExp))
      props.callBack(updated, false)
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
      props.callBack(updated, false)
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
      props.callBack(updated, false)
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
    props.callBack(updated, false)
  }

  React.useEffect(() => {
    getPivotScopeInfo(props.studyPivotConfigs)
    setCols([])
    setCols(FilterExpressionbuildColumnArray(changedFilterExp))
  }, [props.studyPivotConfigs])

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
      const key = getPivotKey(val, changedFilterExp)

      return (
        <span>
          <Dropdown
            selectedKey={key}
            onChange={onPivotSelected}
            options={selectedPivotsKeys}
            id={`${index}_${column?.name}`}
          />
        </span>
      )
    }
    if (column?.key === 'PivotOperator') {
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
