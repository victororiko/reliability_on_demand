import { IColumn, IDropdownOption, buildColumns } from '@fluentui/react'
import {
  Vertical,
  Pivot,
  PivotSQLResult,
  FilterExpTable,
} from '../../models/failurecurve.model'

// converting verticals to Idropdown Pair
export const getVerticalNames = (verticals: Vertical[]): IDropdownOption[] => {
  const res: IDropdownOption[] = []
  for (const v of verticals) {
    const p: IDropdownOption = {
      key: v.PivotSourceSubType.concat('_', v.VerticalName),
      text: v.VerticalName,
    }
    res.push(p)
  }

  return res
}

// Given verticals it returns the different pivotsource subtype array
export const extractModesFromVerticalPair = (
  verticals: IDropdownOption[]
): IDropdownOption[] => {
  const modesSet: Set<String> | undefined = new Set<string>()
  const modes: IDropdownOption[] = []
  const p = {
    key: 'Select Mode',
    text: 'Select Mode',
  }
  modes.push(p)
  for (let i = 0; i < verticals.length; i++) {
    if (!modesSet?.has(verticals[i].key.toString().split('_')[0])) {
      const ele = {
        key: verticals[i].key.toString().split('_')[0],
        text: verticals[i].key.toString().split('_')[0],
      }
      modes.push(ele)
      modesSet.add(verticals[i].key.toString().split('_')[0])
    }
  }

  return modes
}

export const extractPivotName = (item: Pivot) => {
  return {
    key: item.PivotKey,
    text: item.PivotSourceColumnName,
  }
}

export const getPivotNames = (input: Pivot[]): IDropdownOption[] => {
  if (input != null && input.length > 0) {
    const result = input.map(extractPivotName)
    return result
  }

  return []
}

export const getPivotIDs = (input: PivotSQLResult[]): string[] => {
  const res: string[] = []
  for (const p of input) res.push(p.PivotKey)

  return res
}

// return the columns in the detailed list
export const buildColumnArray = (data: Pivot[]): IColumn[] => {
  const arr = buildColumns(data)
  const cols: IColumn[] = []

  for (const ele of arr) {
    switch (ele.fieldName) {
      case 'PivotSourceColumnName':
        cols.push({
          key: ele.fieldName ?? '',
          name: ele.fieldName ?? '',
          fieldName: ele.fieldName ?? '',
          minWidth: 100,
          maxWidth: 200,
          isResizable: true,
        })
        break

      case 'IsApportionJoinPivot':
        cols.push({
          key: ele.fieldName ?? '',
          name: ele.fieldName ?? '',
          fieldName: ele.fieldName ?? '',
          minWidth: 50,
          maxWidth: 150,
          isResizable: true,
        })
        break

      case 'IsApportionPivot':
        cols.push({
          key: ele.fieldName ?? '',
          name: ele.fieldName ?? '',
          fieldName: ele.fieldName ?? '',
          minWidth: 50,
          maxWidth: 130,
          isResizable: true,
        })
        break

      case 'IsKeyPivot':
      case 'IsSelectPivot':
      case 'IsScopeFilter':
        cols.push({
          key: ele.fieldName ?? '',
          name: ele.fieldName ?? '',
          fieldName: ele.fieldName ?? '',
          minWidth: 50,
          maxWidth: 100,
          isResizable: true,
        })
        break

      default:
        break
    }
  }
  return cols
}

// Returns the rows in the detailed list
export const mapPivotTableColumnValue = (
  arr: Pivot[],
  row: number,
  colname: string,
  val: any
): Pivot[] => {
  const res: Pivot[] = []
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
    default:
      break
  }
  return res
}

// for given PivotSQLResult convert it to PivotTable
export const getPivotTableFromPivotSQL = (data: PivotSQLResult[]): Pivot[] => {
  const temp: Pivot[] = []
  for (let pivotptr = 0; pivotptr < data.length; pivotptr++) {
    const filterexps: FilterExpTable[] = []
    for (let smapptr = 0; smapptr < data[pivotptr].smap.length; smapptr++) {
      for (
        let filterptr = 0;
        filterptr < data[pivotptr].smap[smapptr].scope.length;
        filterptr++
      ) {
        const filterexp: FilterExpTable = {
          PivotKey: data[pivotptr].PivotKey,
          PivotName: data[pivotptr].PivotSourceColumnName,
          PivotScopeID: data[pivotptr].smap[smapptr].PivotScopeID,
          PivotValue:
            data[pivotptr].smap[smapptr].scope[filterptr].PivotScopeValue,
          Operator: data[pivotptr].smap[smapptr].scope[filterptr].PivotOperator,
          RelationalOperator: data[pivotptr].smap[smapptr].PivotScopeOperator,
          UIInputDataType: data[pivotptr].UIInputDataType,
        }

        filterexps.push(filterexp)
      }
    }
    const item: Pivot = {
      PivotSourceColumnName: data[pivotptr].PivotSourceColumnName,
      IsApportionJoinPivot:
        data[pivotptr].smap[0].IsApportionJoinColumn === null
          ? false
          : data[pivotptr].smap[0].IsApportionJoinColumn,
      IsApportionPivot:
        data[pivotptr].smap[0].IsApportionColumn === null
          ? false
          : data[pivotptr].smap[0].IsApportionColumn,
      IsKeyPivot:
        data[pivotptr].smap[0].IsKeyColumn === null
          ? false
          : data[pivotptr].smap[0].IsKeyColumn,
      IsSelectPivot:
        data[pivotptr].smap[0].IsSelectColumn === null
          ? false
          : data[pivotptr].smap[0].IsSelectColumn,
      IsScopeFilter: data[pivotptr].smap[0].PivotScopeID !== -1,
      UIInputDataType: data[pivotptr].UIInputDataType,
      PivotKey: data[pivotptr].PivotKey,
      FilterExpressions: filterexps,
    }
    temp.push(item)
  }
  return temp
}

// add the new pivot selections to the PivotTable
export const AddNewSelectedPivots = (
  data: string[],
  input: Pivot[],
  temp: Pivot[]
): Pivot[] => {
  let flag: boolean = false
  // Add the new selected enteries
  for (const ele of data) {
    flag = false

    for (const e of temp) {
      if (ele === e.PivotKey) {
        flag = true
        break
      }
    }

    if (flag === false) {
      let tobeAddedePivotDataType = ''
      let name = ''
      let pivotkey = ''
      for (const element of input) {
        if (element.PivotKey === ele) {
          name = element.PivotSourceColumnName
          tobeAddedePivotDataType = element.UIInputDataType
          pivotkey = element.PivotKey
          break
        }
      }

      const item: Pivot = {
        PivotSourceColumnName: name,
        IsApportionJoinPivot: false,
        IsApportionPivot: false,
        IsKeyPivot: false,
        IsScopeFilter: false,
        IsSelectPivot: false,
        UIInputDataType: tobeAddedePivotDataType,
        PivotKey: pivotkey,
        FilterExpressions: [],
      }
      temp.push(item)
    }
  }

  return temp
}

// building cols for the Filter Expression detailed list
export const FilterExpressionbuildColumnArray = (input: any): IColumn[] => {
  const arr = buildColumns(input)
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
    key: 'Operator',
    name: 'Operator',
    fieldName: 'Operator',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
  })

  cols.push({
    key: 'PivotValue',
    name: 'PivotValue',
    fieldName: 'PivotValue',
    minWidth: 100,
    maxWidth: 300,
    isResizable: true,
  })

  for (const ele of arr) {
    if (
      ele.fieldName !== 'PivotID' &&
      ele.fieldName !== 'PivotScopeID' &&
      ele.fieldName !== 'PivotName' &&
      ele.fieldName !== 'Operator' &&
      ele.fieldName !== 'PivotValue' &&
      ele.fieldName !== 'UIInputDataType' &&
      ele.fieldName !== 'PivotKey'
    )
      cols.push({
        key: ele.fieldName ?? '',
        name: ele.fieldName ?? '',
        fieldName: ele.fieldName ?? '',
        minWidth: 100,
        maxWidth: 300,
        isResizable: true,
      })
  }

  return cols
}

// load relational operators
export const loadRelationalOperators = (): IDropdownOption[] => {
  const arr: IDropdownOption[] = []
  arr.push({ key: '', text: '' })
  arr.push({ key: 'AND', text: 'AND' })
  arr.push({ key: 'OR', text: 'OR' })

  return arr
}

// load load operators
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

  return arr
}

// Fetch vertical names from the pair
export const getVerticalNamesFromPair = (list: IDropdownOption[]): string[] => {
  const verticalnames: string[] = []
  for (let i = 0; i < list.length; i++) {
    verticalnames.push(list[i].text)
  }
  return verticalnames
}

// It loads the splits the filter expression in the SQL table and break it into pieces desired by UI to represent
// Like SQL data has "Build >= 21000" => this function will add a row in "DefaultPivot" array with (PivotID,Build,21000,PivotScopeID,>=, RelationalOperator)
// This help in populating the detailedlist controls with the required information.
export const loadFilterExpressionTable = (input: Pivot[]): FilterExpTable[] => {
  const res: FilterExpTable[] = []

  for (const ele of input) {
    if (
      ele.IsScopeFilter === true &&
      ele.FilterExpressions !== null &&
      ele.FilterExpressions.length > 0
    ) {
      for (const row of ele.FilterExpressions) {
        res.push(row)
      }
    }
  }

  if (res === null || res.length === 0)
    res.push({
      PivotName: '',
      PivotValue: '',
      PivotScopeID: 0,
      Operator: '',
      RelationalOperator: '',
      UIInputDataType: '',
      PivotKey: '',
    })

  return res
}

// It checks which element from the array does the input contains
export const getContainingElementFromArr = (
  input: string,
  arr: IDropdownOption[]
): string => {
  let res: string = ''
  for (const op of arr) {
    if (input?.indexOf(op.key.toString()) !== -1 && op.key !== '') {
      res = op.key.toString()
      break
    }
  }

  return res
}

// Get pivot id
export const getPivotID = (input: any, pivots: FilterExpTable[]): string => {
  for (const d of pivots) {
    if (d.PivotName === input.fieldContent) {
      return d.PivotKey
    }
  }

  return ''
}

// get all the pivots selected for filter expression
export const getAllFilteredPivots = (input: Pivot[]): IDropdownOption[] => {
  const pivotsToFilter: IDropdownOption[] = []
  for (const ele of input) {
    if (ele.IsScopeFilter === true) {
      pivotsToFilter.push({
        key: ele.PivotKey,
        text: ele.PivotSourceColumnName,
      })
    }
  }

  return pivotsToFilter
}

// map col names in filter expression table to the object value
export const mapFilterExpTableColumnValue = (
  arr: FilterExpTable[],
  row: number,
  colname: string,
  val: any
): FilterExpTable[] => {
  const FilterExpTableTemp = arr

  switch (colname) {
    case 'Operator':
      FilterExpTableTemp[row].Operator = val
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
      FilterExpTableTemp[row].PivotValue = val
      break
    case 'RelationalOperator':
      FilterExpTableTemp[row].RelationalOperator = val
      break
    default:
      break
  }

  return FilterExpTableTemp
}

// Get relational count to form the filter expression
export const getRelationalOperatorCount = (input: FilterExpTable[]): number => {
  let ropCount = 0
  for (const ele of input) {
    if (ele.RelationalOperator !== null && ele.RelationalOperator !== '') {
      ropCount += 1
    }
  }

  return ropCount
}

// forming filter expression to display it to the user
export const showFilterExpression = (input: FilterExpTable[]) => {
  let filterexp = ''
  let lastPieceInExp = ''

  for (const ele of input) {
    if (ele.RelationalOperator !== null && ele.RelationalOperator !== '') {
      filterexp = `${filterexp} ${ele.PivotName} ${ele.Operator} ${ele.PivotValue} ${ele.RelationalOperator}`
    } else {
      lastPieceInExp = `${ele.PivotName} ${ele.Operator} ${ele.PivotValue}`
    }
  }

  filterexp = `${filterexp} ${lastPieceInExp}`

  filterexp = filterexp.trim()

  return filterexp
}

export const getFailureCurvePivotsToSave = (
  filterExpTable: FilterExpTable[],
  pivots: Pivot[]
): Pivot[] => {
  // Update the existing filter expression first empty out all the filter expression
  for (const row of pivots) {
    row.FilterExpressions = []
  }
  // Add the new enteries in the filter expression
  for (const ele of filterExpTable) {
    const pkey = ele.PivotKey
    for (let i = 0; i < pivots.length; i++) {
      const key = pivots[i].PivotKey
      if (pkey === key) {
        const filterexp: FilterExpTable = {
          PivotKey: ele.PivotKey,
          PivotName: ele.PivotName,
          PivotScopeID: ele.PivotScopeID,
          PivotValue: ele.PivotValue,
          Operator: ele.Operator,
          RelationalOperator: ele.RelationalOperator,
          UIInputDataType: ele.UIInputDataType,
        }
        pivots[i].FilterExpressions.push(filterexp)
        break
      }
    }
  }

  return pivots
}
