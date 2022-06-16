import { IColumn, IDropdownOption, buildColumns } from '@fluentui/react'
import {
  Vertical,
  Pair,
  Pivot,
  PivotSQLResult,
  PivotTable,
} from '../../models/failurecurve.model'

// converting verticals to Idropdown Pair
export const getVerticalNames = (
  verticals: Vertical[]
): IDropdownOption<Pair>[] => {
  const result = verticals.map(extractVerticalName)
  return result
}

// converting vertical type to Pair
export const extractVerticalName = (item: Vertical) => {
  const p: Pair = {
    key: item.PivotSourceSubType.concat('_', item.VerticalName),
    text: item.VerticalName,
  }
  return p
}

// Given verticals it returns the different pivotsource subtype array
export const extractModesFromVerticalPair = (verticals: Pair[]): Pair[] => {
  const modesSet: Set<String> | undefined = new Set<string>()
  const modes: Pair[] = []
  const p = {
    key: 'Select Mode',
    text: 'Select Mode',
  }
  modes.push(p)
  for (let i = 0; i < verticals.length; i++) {
    if (!modesSet?.has(verticals[i].key.split('_')[0])) {
      const ele = {
        key: verticals[i].key.split('_')[0],
        text: verticals[i].key.split('_')[0],
      }
      modes.push(ele)
      modesSet.add(verticals[i].key.split('_')[0])
    }
  }

  return modes
}

export const extractPivotName = (item: Pivot) => {
  return {
    key: item.PivotID,
    text: item.PivotSourceColumnName,
  }
}

export const getPivotNames = (input: Pivot[]): IDropdownOption<Pair>[] => {
  if (input != null && input.length > 0) {
    const result = input.map(extractPivotName)
    return result
  }

  return []
}

export const getPivotIDs = (input: PivotSQLResult[]): number[] => {
  const res: number[] = []
  for (const p of input) res.push(p.PivotID)

  return res
}

// return the columns in the detailed list
export const buildColumnArray = (data: PivotTable[]): IColumn[] => {
  const arr = buildColumns(data)
  const cols: IColumn[] = []

  for (const ele of arr) {
    if (ele.fieldName === 'PivotName') {
      cols.push({
        key: ele.fieldName ?? '',
        name: ele.fieldName ?? '',
        fieldName: ele.fieldName ?? '',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      })
    } else if (
      ele.fieldName?.includes('Apportion') &&
      ele.fieldName?.includes('Join')
    ) {
      cols.push({
        key: ele.fieldName ?? '',
        name: ele.fieldName ?? '',
        fieldName: ele.fieldName ?? '',
        minWidth: 50,
        maxWidth: 150,
        isResizable: true,
      })
    } else if (ele.fieldName?.includes('Apportion')) {
      cols.push({
        key: ele.fieldName ?? '',
        name: ele.fieldName ?? '',
        fieldName: ele.fieldName ?? '',
        minWidth: 50,
        maxWidth: 130,
        isResizable: true,
      })
    } else if (
      ele.fieldName !== 'PivotID' &&
      ele.fieldName !== 'PivotScopeID' &&
      ele.fieldName !== 'FilterExpressionOperator' &&
      ele.fieldName !== 'FilterExpression' &&
      ele.fieldName !== 'UIInputDataType'
    )
      cols.push({
        key: ele.fieldName ?? '',
        name: ele.fieldName ?? '',
        fieldName: ele.fieldName ?? '',
        minWidth: 50,
        maxWidth: 100,
        isResizable: true,
      })
  }

  return cols
}

// Returns the rows in the detailed list
export const mapPivotTableColumnValue = (
  arr: PivotTable[],
  row: number,
  colname: string,
  val: any
): PivotTable[] => {
  const res: PivotTable[] = []
  for (const ele of arr) res.push(ele)
  switch (colname) {
    case 'IsSelectPivot':
      res[row].IsSelectPivot = val
      break
    case 'IsKeyPivot':
      res[row].IsKeyPivot = val
      break
    case 'IsApportionPivot':
      res[row].IsApportionPivot = val
      break
    case 'IsApportionJoinPivot':
      res[row].IsApportionJoinPivot = val
      break
    case 'IsScopeFilter':
      res[row].IsScopeFilter = val
      break
    case 'FilterExpression':
      res[row].FilterExpression = val
      break
    case 'FilterExpressionOperator':
      res[row].FilterExpressionOperator = val
      break
    default:
      break
  }
  return res
}

// for given PivotSQLResult convert it to PivotTable
export const getPivotTableFromPivotSQL = (
  data: PivotSQLResult[]
): PivotTable[] => {
  const temp: PivotTable[] = []
  for (const ele of data) {
    const item: PivotTable = {
      PivotID: ele.PivotID,
      PivotName: ele.PivotSourceColumnName,
      IsApportionJoinPivot:
        ele.smap[0].IsApportionJoinColumn === null
          ? false
          : ele.smap[0].IsApportionJoinColumn,
      IsApportionPivot:
        ele.smap[0].IsApportionColumn === null
          ? false
          : ele.smap[0].IsApportionColumn,
      IsKeyPivot:
        ele.smap[0].IsKeyColumn === null ? false : ele.smap[0].IsKeyColumn,
      IsSelectPivot:
        ele.smap[0].IsSelectColumn === null
          ? false
          : ele.smap[0].IsSelectColumn,
      IsScopeFilter: ele.smap[0].PivotScopeID !== null,
      PivotScopeID: ele.smap[0].PivotScopeID,
      FilterExpression: ele.smap[0].scope[0].PivotScopeValue,
      FilterExpressionOperator: ele.smap[0].scope[0].PivotScopeOperator,
      UIInputDataType: ele.UIInputDataType,
    }
    temp.push(item)
  }
  return temp
}

// add the new pivot selections to the PivotTable
export const AddNewSelectedPivots = (
  data: number[],
  input: Pivot[],
  temp: PivotTable[]
): PivotTable[] => {
  let flag: boolean = false
  // Add the new selected enteries
  for (const ele of data) {
    flag = false

    for (const e of temp) {
      if (ele === e.PivotID) {
        flag = true
        break
      }
    }

    if (flag === false) {
      let tobeAddedePivotDataType = ''
      let name = ''
      for (const element of input) {
        if (element.PivotID === ele) {
          name = element.PivotSourceColumnName
          tobeAddedePivotDataType = element.UIInputDataType
          break
        }
      }

      const item: PivotTable = {
        PivotID: ele,
        PivotName: name,
        IsApportionJoinPivot: false,
        IsApportionPivot: false,
        IsKeyPivot: false,
        IsScopeFilter: false,
        IsSelectPivot: false,
        FilterExpression: '',
        FilterExpressionOperator: '',
        PivotScopeID: 0,
        UIInputDataType: tobeAddedePivotDataType,
      }
      temp.push(item)
    }
  }

  return temp
}
