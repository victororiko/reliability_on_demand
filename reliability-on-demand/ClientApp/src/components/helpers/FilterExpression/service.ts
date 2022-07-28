import { IColumn, IDropdownOption } from '@fluentui/react'
import {
  FilterExpTable,
  Pivot,
  StudyPivotConfig,
  StudyConfigIDWithScopesInquiry,
} from '../../../models/filterexpression.model'
import { CreateNewID } from '../utils'

// load relational operators
export const loadRelationalOperators = (): IDropdownOption[] => {
  const arr: IDropdownOption[] = []
  arr.push({ key: '', text: '' })
  arr.push({ key: 'AND', text: 'AND' })
  arr.push({ key: 'OR', text: 'OR' })

  return arr
}

// load operators
export const loadOperators = (): IDropdownOption[] => {
  const arr: IDropdownOption[] = []
  // Order is important as '>=' should be detected and not be confused with '>'
  arr.push({ key: '', text: '' })
  arr.push({ key: '>=', text: '>=' })
  arr.push({ key: '<=', text: '<=' })
  arr.push({ key: '==', text: '==' })
  arr.push({ key: '!=', text: '!=' })
  arr.push({ key: '<', text: '<' })
  arr.push({ key: '>', text: '>' })
  arr.push({ key: 'IN', text: 'IN' })

  return arr
}

// map col names in filter expression table to the object value
export const mapFilterExpTableColumnValue = (
  arr: StudyPivotConfig[],
  row: number,
  colname: string,
  val: any
): StudyPivotConfig[] => {
  const FilterExpTableTemp = arr

  switch (colname) {
    case 'Operator':
      FilterExpTableTemp[row].PivotOperator = val
      break
    case 'PivotKey':
      FilterExpTableTemp[row].PivotKey = val
      break
    case 'PivotName':
      FilterExpTableTemp[row].PivotName = val
      break
    case 'PivotScopeID':
      FilterExpTableTemp[row].PivotScopeID = val
      break
    case 'PivotValue':
      FilterExpTableTemp[row].PivotScopeValue = val
      break
    case 'RelationalOperator':
      FilterExpTableTemp[row].RelationalOperator = val
      break
    default:
      break
  }

  return FilterExpTableTemp
}

// map pivot data to operators and operator to Pivot values
export const getPivotMap = (
  input: FilterExpTable[]
): Map<string, Map<string, IDropdownOption[]>> => {
  const map = new Map<string, Map<string, IDropdownOption[]>>()

  for (const ele of input) {
    if (map.has(ele.PivotKey)) {
      const innerMap = map.get(ele.PivotKey)
      let arr: IDropdownOption[] = [
        { key: 'Add new value', text: 'Add new value' },
      ]

      if (innerMap?.has(ele.Operator)) {
        arr = innerMap.get(ele.Operator) || []
      }
      arr?.push({ key: ele.PivotValue, text: ele.PivotValue })
      map.get(ele.PivotKey)?.set(ele.Operator, arr)
    } else {
      const m = new Map<string, IDropdownOption[]>()
      const arr: IDropdownOption[] = [
        { key: 'Add new value', text: 'Add new value' },
      ]
      arr?.push({ key: ele.PivotValue, text: ele.PivotValue })
      m.set(ele.Operator, arr)
      map.set(ele.PivotKey, m)
    }
  }

  return map
}

export const isEqual = (p1: Pivot, p2: Pivot): boolean => {
  return (
    p1.PivotKey === p2.PivotKey &&
    p1.PivotName === p2.PivotName &&
    p1.PivotScopeID === p2.PivotScopeID &&
    p1.RelationalOperator === p2.RelationalOperator &&
    p1.UIDataType === p2.UIDataType
  )
}

// Function that takes in the not null pivotscopeids and set the selected value for the control for given pivot keys
export const getDefaultFilterExpression = (
  studyConfig: StudyPivotConfig[],
  pivotscopes: FilterExpTable[]
): FilterExpTable[] => {
  const res: FilterExpTable[] = []

  for (const ele of studyConfig) {
    if (ele.PivotScopeID !== null) {
      for (const scope of pivotscopes) {
        if (ele.PivotScopeID === scope.PivotScopeID) {
          const row: FilterExpTable = {
            PivotKey: scope.PivotKey,
            PivotName: scope.PivotName,
            PivotScopeID: scope.PivotScopeID,
            PivotValue: scope.PivotValue,
            Operator: scope.Operator,
            RelationalOperator: scope.RelationalOperator,
            UIInputDataType: scope.UIInputDataType,
          }

          res.push(row)
        }
      }
    }
  }

  return res
}

// building cols for the Filter Expression detailed list
export const FilterExpressionbuildColumnArray = (input: any): IColumn[] => {
  const cols: IColumn[] = []

  cols.push({
    key: 'Add/Delete',
    name: 'Add/Delete',
    fieldName: 'Add/Delete',
    minWidth: 50,
    maxWidth: 100,
    isResizable: true,
  })

  cols.push({
    key: 'PivotName',
    name: 'PivotName',
    fieldName: 'PivotName',
    minWidth: 100,
    maxWidth: 350,
    isResizable: true,
  })

  cols.push({
    key: 'PivotOperator',
    name: 'Operator',
    fieldName: 'PivotOperator',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
  })

  cols.push({
    key: 'PivotScopeValue',
    name: 'PivotValue',
    fieldName: 'PivotScopeValue',
    minWidth: 100,
    maxWidth: 300,
    isResizable: true,
  })

  cols.push({
    key: 'RelationalOperator',
    name: 'RelationalOperator',
    fieldName: 'RelationalOperator',
    minWidth: 100,
    maxWidth: 300,
    isResizable: true,
  })

  return cols
}

export const getPivotScopeIDs = (
  input: StudyPivotConfig[]
): StudyConfigIDWithScopesInquiry => {
  const res: StudyConfigIDWithScopesInquiry = {
    StudyConfigID: input[0].StudyConfigID,
    PivotScopeIDs: [],
  }

  for (const row of input) {
    if (row.PivotScopeID !== null && row.PivotScopeID !== CreateNewID)
      res.PivotScopeIDs.push(row.PivotScopeID)
  }

  return res
}

export const convertFilterExpToStudyConfigOutput = (
  input: FilterExpTable[],
  studyID: number
): StudyPivotConfig[] => {
  const res: StudyPivotConfig[] = []

  for (const ele of input) {
    const row: StudyPivotConfig = {
      PivotKey: ele.PivotKey,
      PivotOperator: ele.Operator,
      PivotScopeID: ele.PivotScopeID,
      RelationalOperator: ele.RelationalOperator,
      PivotScopeValue: ele.PivotValue,
      UIDataType: ele.UIInputDataType,
      StudyConfigID: studyID,
    }

    res.push(row)
  }

  return res
}

// Get pivot key
export const getPivotKey = (input: any, pivots: StudyPivotConfig[]): string => {
  for (const d of pivots) {
    if (d.PivotName === input.fieldContent) {
      return d.PivotKey
    }
  }

  return ''
}

export const getPivotNamePairs = (
  input: FilterExpTable[]
): IDropdownOption[] => {
  const res: IDropdownOption[] = []
  for (const ele of input) {
    const p: IDropdownOption = {
      key: ele.PivotKey,
      text: ele.PivotName,
    }
    res.push(p)
  }

  return res
}

export const getPivotValuesForGivenPivotAndOperator = (
  map: Map<string, Map<string, IDropdownOption[]>>,
  pivotkey: string,
  operator: string
): IDropdownOption[] | undefined => {
  return map.get(pivotkey)?.get(operator)
}

// get all the pivots selected for filter expression
export const getAllFilteredPivots = (
  input: StudyPivotConfig[]
): IDropdownOption[] => {
  const uniquePivotNames = new Set<string>()
  const pivotsToFilter: IDropdownOption[] = []
  for (const ele of input) {
    if (!uniquePivotNames.has(ele.PivotKey)) {
      pivotsToFilter.push({
        key: ele.PivotKey,
        text: ele.PivotKey.slice(ele.PivotKey.indexOf('_') + 1),
      })

      uniquePivotNames.add(ele.PivotKey)
    }
  }

  return pivotsToFilter
}

export const convertStudyPivotToFilterExp = (
  input: StudyPivotConfig[]
): FilterExpTable[] => {
  const res: FilterExpTable[] = []

  for (const ele of input) {
    const row: FilterExpTable = {
      PivotKey: ele.PivotKey,
      PivotName: ele.PivotKey.slice(ele.PivotKey.indexOf('_') + 1),
      PivotScopeID: ele.PivotScopeID,
      PivotValue: ele.PivotScopeValue ?? '',
      Operator: ele.PivotOperator ?? '',
      RelationalOperator: ele.RelationalOperator ?? '',
      UIInputDataType: ele.UIDataType ?? '',
    }

    res.push(row)
  }

  return res
}
