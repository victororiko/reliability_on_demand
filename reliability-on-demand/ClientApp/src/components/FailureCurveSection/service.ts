import { IColumn, IDropdownOption, buildColumns } from '@fluentui/react'
import { Vertical } from '../../models/failurecurve.model'
import { StudyPivotConfig } from '../../models/filterexpression.model'
import { Pivot } from '../../models/pivot.model'
import { CreateNewID } from '../helpers/utils'

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

export const getPivotNames = (input: Pivot[]): IDropdownOption[] => {
  const arr: IDropdownOption[] = []
  for (const ele of input) {
    const row: IDropdownOption = {
      key: ele.PivotKey,
      text: ele.PivotName ?? '',
    }

    arr.push(row)
  }

  return arr
}

export const getPivotIDs = (input: Pivot[]): string[] => {
  const res: string[] = []
  const set = new Set<string>()
  for (const p of input) {
    if (!set.has(p.PivotKey)) {
      res.push(p.PivotKey)
      set.add(p.PivotKey)
    }
  }

  return res
}

export const getUniqueMappedPivotWithScopeFilter = (
  input: Pivot[],
  studyconfigID: number
): Pivot[] => {
  const res: Pivot[] = []
  const set = new Set<string>()

  for (const ele of input) {
    if (!set.has(ele.PivotKey)) {
      const row: Pivot = {
        PivotKey: ele.PivotKey,
        PivotScopeID: ele.PivotScopeID,
        PivotName: ele.PivotName,
        PivotOperator: ele.PivotOperator,
        PivotScopeValue: ele.PivotScopeValue,
        ADLDataType: ele.ADLDataType,
        UIDataType: ele.UIDataType,
        IsApportionColumn: ele.IsApportionColumn,
        IsApportionJoinColumn: ele.IsApportionJoinColumn,
        IsKeyColumn: ele.IsKeyColumn,
        IsSelectColumn: ele.IsSelectColumn,
        IsScopeFilter: ele.PivotScopeID !== -1,
        StudyConfigID: studyconfigID,
        RelationalOperator: ele.RelationalOperator,
        AggregateBy: false,
        PivotExpression: '',
      }
      res.push(row)
      set.add(ele.PivotKey)
    }
  }
  return res
}

export const getMappedPivotWithScopeFilter = (
  input: Pivot[],
  studyconfigID: number
): Pivot[] => {
  const res: Pivot[] = []

  for (const ele of input) {
    const row: Pivot = {
      PivotKey: ele.PivotKey,
      PivotScopeID: ele.PivotScopeID,
      PivotName: ele.PivotName,
      PivotOperator: ele.PivotOperator,
      PivotScopeValue: ele.PivotScopeValue,
      ADLDataType: ele.ADLDataType,
      UIDataType: ele.UIDataType,
      IsApportionColumn: ele.IsApportionColumn,
      IsApportionJoinColumn: ele.IsApportionJoinColumn,
      IsKeyColumn: ele.IsKeyColumn,
      IsSelectColumn: ele.IsSelectColumn,
      IsScopeFilter: ele.PivotScopeID !== -1,
      StudyConfigID: studyconfigID,
      RelationalOperator: ele.RelationalOperator,
      AggregateBy: false,
      PivotExpression: '',
    }
    res.push(row)
  }
  return res
}

// return the columns in the detailed list
export const buildColumnArray = (data: Pivot[]): IColumn[] => {
  const arr = buildColumns(data)
  const cols: IColumn[] = []

  for (const ele of arr) {
    switch (ele.fieldName) {
      case 'PivotName':
        cols.push({
          key: ele.fieldName ?? '',
          name: ele.fieldName ?? '',
          fieldName: ele.fieldName ?? '',
          minWidth: 100,
          maxWidth: 200,
          isResizable: true,
        })
        break

      case 'IsApportionJoinColumn':
        cols.push({
          key: ele.fieldName ?? '',
          name: ele.fieldName ?? '',
          fieldName: ele.fieldName ?? '',
          minWidth: 50,
          maxWidth: 150,
          isResizable: true,
        })
        break

      case 'IsApportionColumn':
        cols.push({
          key: ele.fieldName ?? '',
          name: ele.fieldName ?? '',
          fieldName: ele.fieldName ?? '',
          minWidth: 50,
          maxWidth: 130,
          isResizable: true,
        })
        break

      case 'IsKeyColumn':
      case 'IsSelectColumn':
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
    case 'IsSelectColumn':
      res[row].IsSelectColumn = val
      break
    case 'IsKeyColumn':
      res[row].IsKeyColumn = val
      break
    case 'IsApportionColumn':
      res[row].IsApportionColumn = val
      break
    case 'IsApportionJoinColumn':
      res[row].IsApportionJoinColumn = val
      break
    case 'IsScopeFilter':
      res[row].IsScopeFilter = val
      break
    default:
      break
  }
  return res
}

// add the new pivot selections to the Pivots
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
          name = element.PivotName ?? ''
          tobeAddedePivotDataType = element.UIDataType ?? ''
          pivotkey = element.PivotKey
          break
        }
      }

      const item: Pivot = {
        PivotName: name,
        IsApportionJoinColumn: false,
        IsApportionColumn: false,
        IsKeyColumn: false,
        IsScopeFilter: false,
        IsSelectColumn: false,
        UIDataType: tobeAddedePivotDataType,
        PivotKey: pivotkey,
        ADLDataType: '',
        AggregateBy: false,
        PivotExpression: '',
        StudyConfigID: 0,
        PivotScopeID: 0,
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
    key: 'PivotOperator',
    name: 'PivotOperator',
    fieldName: 'PivotOperator',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
  })

  cols.push({
    key: 'PivotScopeValue',
    name: 'PivotScopeValue',
    fieldName: 'PivotScopeValue',
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

// It checks which element from the array does the input contains
export const getContainingElementFromArr = (
  input: string,
  arr: IDropdownOption[]
): string => {
  let res: string = ''
  for (const op of arr) {
    if (input?.indexOf(op.key.toString()) !== CreateNewID && op.key !== '') {
      res = op.key.toString()
      break
    }
  }

  return res
}

// Get pivot keys
export const getPivotID = (input: any, pivots: Pivot[]): string => {
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
        text: ele.PivotName ?? '',
      })
    }
  }

  return pivotsToFilter
}

// map col names in filter expression table to the object value
export const mapFilterExpTableColumnValue = (
  arr: Pivot[],
  row: number,
  colname: string,
  val: any
): Pivot[] => {
  const FilterExpTableTemp = arr

  switch (colname) {
    case 'PivotOperator':
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
    case 'PivotScopeValue':
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

// Get relational count to form the filter expression
export const getRelationalOperatorCount = (input: Pivot[]): number => {
  let ropCount = 0
  for (const ele of input) {
    if (ele.RelationalOperator !== null && ele.RelationalOperator !== '') {
      ropCount += 1
    }
  }

  return ropCount
}

// forming filter expression to display it to the user
export const showFilterExpression = (input: Pivot[]) => {
  let filterexp = ''
  let lastPieceInExp = ''

  for (const ele of input) {
    if (ele.RelationalOperator !== null && ele.RelationalOperator !== '') {
      filterexp = `${filterexp} ${ele.PivotName} ${ele.PivotOperator} ${ele.PivotScopeValue} ${ele.RelationalOperator}`
    } else {
      lastPieceInExp = `${ele.PivotName} ${ele.PivotOperator} ${ele.PivotScopeValue}`
    }
  }

  filterexp = `${filterexp} ${lastPieceInExp}`

  filterexp = filterexp.trim()

  return filterexp
}

// Return the list of pivots that forms the filter expression
export const getFilterPivots = (
  input: Pivot[],
  selected: Pivot[],
  StudyConfigID: number
): Pivot[] => {
  // Adding the common pivots
  const res: Pivot[] = []
  const addedPivots = new Set<String>()

  for (const ele of input) {
    if (ele.IsScopeFilter === true) {
      for (const s of selected) {
        if (ele.PivotKey === s.PivotKey && s.IsScopeFilter === true) {
          addedPivots.add(ele.PivotKey)
          res.push(ele)
          break
        }
      }
    }
  }

  // Add new filter pivots

  for (const ele of selected) {
    if (!addedPivots.has(ele.PivotKey) && ele.IsScopeFilter === true) {
      const row: Pivot = {
        ADLDataType: ele.ADLDataType,
        IsApportionColumn: ele.IsApportionColumn,
        IsApportionJoinColumn: ele.IsApportionJoinColumn,
        IsKeyColumn: ele.IsKeyColumn,
        IsSelectColumn: ele.IsSelectColumn,
        IsScopeFilter: ele.IsScopeFilter,
        AggregateBy: ele.AggregateBy,
        PivotExpression: ele.PivotExpression,
        PivotKey: ele.PivotKey,
        StudyConfigID,
        PivotScopeID: -1,
        UIDataType: ele.UIDataType,
      }

      res.push(row)
    }
  }

  return res
}

// returns the list of combined pivots to be saved in the backend
export const getDataToSaveUsingPivot = (
  input: StudyPivotConfig[],
  pivots: Pivot[],
  verticals: IDropdownOption[],
  mode: string,
  StudyConfigID: number
): Pivot[] => {
  const res: Pivot[] = []

  const verticalnames = getVerticalNamesFromPair(verticals)

  for (const p of pivots) {
    p.PivotSourceSubType = mode
    p.StudyConfigID = StudyConfigID
    p.Verticals = []
    for (const v of verticalnames) p.Verticals?.push(v)

    if (p.IsScopeFilter === true) {
      let hasScoped: boolean = false

      for (const exp of input) {
        if (exp.PivotKey === p.PivotKey) {
          hasScoped = true
          const row: Pivot = {
            ADLDataType: p.ADLDataType,
            IsApportionColumn: p.IsApportionColumn,
            IsApportionJoinColumn: p.IsApportionJoinColumn,
            IsKeyColumn: p.IsKeyColumn,
            IsSelectColumn: p.IsSelectColumn,
            IsScopeFilter: p.IsScopeFilter,
            AggregateBy: p.AggregateBy,
            PivotExpression: p.PivotExpression,
            PivotKey: p.PivotKey,
            StudyConfigID,
            PivotScopeID: exp.PivotScopeID,
            RelationalOperator: exp.RelationalOperator,
            PivotName: p.PivotName,
            PivotOperator: exp.PivotOperator,
            PivotScopeValue: exp.PivotScopeValue,
            PivotSourceSubType: p.PivotSourceSubType,
            UIDataType: p.UIDataType,
            Verticals: p.Verticals,
          }
          res.push(row)
        }
      }

      if (hasScoped === false) {
        p.IsScopeFilter = false
        p.PivotScopeID = -1
      }

      if (
        (p.IsApportionColumn === true ||
          p.IsApportionJoinColumn === true ||
          p.IsKeyColumn === true ||
          p.IsSelectColumn === true) &&
        hasScoped === false
      ) {
        res.push(p)
      }
    } else {
      res.push(p)
    }
  }

  return res
}
