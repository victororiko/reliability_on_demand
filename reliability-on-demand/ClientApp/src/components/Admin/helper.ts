import { buildColumns, IColumn, IComboBoxOption } from '@fluentui/react'
import { StudyPivotConfig } from '../../models/filterexpression.model'
import { Pivot } from '../../models/pivot.model'
import { TeamConfig } from '../../models/team.model'
import { EmptyFieldErrorMessage, MinWidth, MaxWidth } from '../helpers/utils'

export const getTeamFromID = (
  selection: number,
  teamConfigs: TeamConfig[]
): TeamConfig | undefined => {
  // extracting TeamID property out of each element and comparing it.
  const parsedStudy = teamConfigs.find(({ TeamID: teamID }) => {
    return teamID === selection
  })
  return parsedStudy
}

// returns the appropriate value for the control
export const getControlValue = (
  currentTeam: TeamConfig | undefined,
  controlValue: string,
  previousID: number,
  callback: any,
  attr: string | undefined
): string | undefined => {
  // To make the field editable for update as well.
  if (currentTeam?.TeamID !== previousID) {
    callback(currentTeam?.OwnerTriageAlias)
    return attr
  }
  return controlValue
}

// validates the user input
export const getErrorMessage = (
  controlValue: string,
  callback: any
): string | undefined => {
  // To make the field editable for update as well.
  if (controlValue === '') {
    callback(controlValue)
    return EmptyFieldErrorMessage
  }
  return ''
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
    case 'AggregateBy':
      res[row].AggregateBy = val
      break
    case 'PivotExpression':
      res[row].PivotExpression = val
      break
    default:
      break
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
          minWidth: 300,
          maxWidth: 350,
          isResizable: true,
        })
        break
      default:
        break
    }
  }

  let newcols: IColumn[] = addDataTypesColumns(data)
  for (const col of newcols) cols.push(col)

  newcols = addCheckBoxColumns(data)
  for (const col of newcols) cols.push(col)

  newcols = addTextBoxColumns(data)
  for (const col of newcols) cols.push(col)

  return cols
}

// add datatype columns in the detailed columns list
const addDataTypesColumns = (data: Pivot[]): IColumn[] => {
  const arr = buildColumns(data)
  const cols: IColumn[] = []

  for (const ele of arr) {
    switch (ele.fieldName) {
      case 'ADLDataType':
      case 'UIDataType':
        cols.push({
          key: ele.fieldName ?? '',
          name: ele.fieldName ?? '',
          fieldName: ele.fieldName ?? '',
          minWidth: MinWidth,
          maxWidth: MaxWidth,
          isResizable: true,
        })
        break
      default:
        break
    }
  }

  return cols
}

// add checbox controls columns list to the detailed list
const addCheckBoxColumns = (data: Pivot[]): IColumn[] => {
  const arr = buildColumns(data)
  const cols: IColumn[] = []

  for (const ele of arr) {
    switch (ele.fieldName) {
      case 'IsApportionJoinColumn':
        cols.push({
          key: ele.fieldName ?? '',
          name: ele.fieldName ?? '',
          fieldName: ele.fieldName ?? '',
          minWidth: MinWidth,
          maxWidth: MaxWidth,
          isResizable: true,
        })
        break

      case 'IsApportionColumn':
        cols.push({
          key: ele.fieldName ?? '',
          name: ele.fieldName ?? '',
          fieldName: ele.fieldName ?? '',
          minWidth: 200,
          maxWidth: 250,
          isResizable: true,
        })
        break

      case 'IsKeyColumn':
      case 'IsSelectColumn':
      case 'AggregateBy':
      case 'IsScopeFilter':
        cols.push({
          key: ele.fieldName ?? '',
          name: ele.fieldName ?? '',
          fieldName: ele.fieldName ?? '',
          minWidth: MinWidth,
          maxWidth: MaxWidth,
          isResizable: true,
        })
        break
      default:
        break
    }
  }

  return cols
}

// add columns that requires textbox control
const addTextBoxColumns = (data: Pivot[]): IColumn[] => {
  const arr = buildColumns(data)
  const cols: IColumn[] = []

  for (const ele of arr) {
    switch (ele.fieldName) {
      case 'PivotExpression':
        cols.push({
          key: ele.fieldName ?? '',
          name: ele.fieldName ?? '',
          fieldName: ele.fieldName ?? '',
          minWidth: MinWidth,
          maxWidth: MaxWidth,
          isResizable: true,
          isMultiline: true,
        })
        break
      default:
        break
    }
  }

  return cols
}

// converting the backend result to pivot for IsScopeFilter mapping
export const convertToPivot = (input: any[]): Pivot[] => {
  const res: Pivot[] = []

  for (const ele of input) {
    const row: Pivot = {
      StudyConfigID: ele.StudyConfigID,
      IsScopeFilter: ele.PivotScopeID !== -1,
      IsApportionColumn: ele.IsApportionColumn,
      IsApportionJoinColumn: ele.IsApportionJoinColumn,
      IsKeyColumn: ele.IsKeyColumn,
      IsSelectColumn: ele.IsSelectColumn,
      PivotScopeID: ele.PivotScopeID,
      ADLDataType: ele.ADLDataType,
      UIDataType: ele.UIDataType,
      RelationalOperator: ele.RelationalOperator,
      PivotOperator: ele.PivotOperator,
      PivotExpression: ele.PivotExpression,
      AggregateBy: ele.AggregateBy,
      PivotKey: ele.PivotKey,
      PivotName: ele.PivotName,
      PivotScopeValue: ele.PivotScopeValue,
      PivotSourceSubType: ele.PivotSourceSubType,
    }

    res.push(row)
  }

  return res
}

// Add a new row to the detailed list oject when + get clicked
export const AddNewPivotsToDetailedList = (
  selectedPivotsPair: IComboBoxOption[],
  data: Pivot[]
): Pivot[] => {
  const res: Pivot[] = []

  for (const ele of data) res.push(ele)

  for (const pair of selectedPivotsPair) {
    let flag: boolean = false
    for (const d of data) {
      if (d.PivotKey === pair.key.toString().split(';')[0]) {
        flag = true
        break
      }
    }

    if (flag === false) {
      const item: Pivot = {
        PivotName: pair.text,
        IsApportionColumn: false,
        IsApportionJoinColumn: false,
        IsKeyColumn: false,
        IsScopeFilter: false,
        IsSelectColumn: false,
        AggregateBy: false,
        UIDataType: pair.key.toString().split(';')[1],
        ADLDataType: pair.key.toString().split(';')[2],
        PivotKey: pair.key.toString().split(';')[0],
        PivotExpression: '',
        PivotScopeID: -1,
        StudyConfigID: -1,
      }

      res.push(item)
    }
  }

  return res
}

// returns StudyPivotConfig from the pivot object
export const convertToStudyConfig = (input: Pivot[]): StudyPivotConfig[] => {
  const arr: StudyPivotConfig[] = []

  for (const ele of input) {
    if (ele.IsScopeFilter === true) {
      const row: StudyPivotConfig = {
        StudyConfigID: ele.StudyConfigID,
        PivotScopeID: ele.PivotScopeID,
        PivotKey: ele.PivotKey,
        PivotName: ele.PivotName,
        PivotOperator: ele.PivotOperator,
        PivotScopeValue: ele.PivotScopeValue,
        RelationalOperator: ele.RelationalOperator,
        UIDataType: ele.UIDataType,
      }

      arr.push(row)
    }
  }

  return arr
}

// deduce the mode from the selcted source
export const getMode = (input: IComboBoxOption): string => {
  if (
    input.key.toString().includes('Watson') &&
    input.key.toString().includes('Kernel')
  )
    return 'KernelMode'
  if (
    input.key.toString().includes('Watson') &&
    input.key.toString().includes('User')
  )
    return 'UserMode'
  return 'AllMode'
}

// Change the pivot detailed list whenever a new pivots gets selected from the multiselect pivot dropdown
export const AddNewSelectedPivots = (
  data: string[],
  temp: Pivot[]
): Pivot[] => {
  let flag: boolean = false
  // Add the new selected enteries
  for (const ele of data) {
    flag = false

    for (const e of temp) {
      if (ele.split(';')[0] === e.PivotKey) {
        flag = true
        break
      }
    }

    if (flag === false) {
      const tobeAddedePivotDataType = ele.split(';')[1]
      const name = ele.split(';')[0].split('_')[1]
      const pivotkey = ele.split(';')[0]

      const item: Pivot = {
        PivotName: name,
        IsApportionJoinColumn: false,
        IsApportionColumn: false,
        IsKeyColumn: false,
        IsScopeFilter: false,
        IsSelectColumn: false,
        UIDataType: tobeAddedePivotDataType,
        PivotKey: pivotkey,
        ADLDataType: ele.split(';')[2],
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

// Get unique pivot pairs selected
export const getUniquePivotKeyPairs = (input: any): IComboBoxOption[] => {
  const res: IComboBoxOption[] = []
  const set = new Set<string>()
  for (const p of input) {
    if (!set.has(p.PivotKey)) {
      const row: IComboBoxOption = {
        key: `${p.PivotKey};${p.UIDataType};${p.ADLDataType}`,
        text: p.PivotName,
      }
      res.push(row)
      set.add(p.PivotKey)
    }
  }

  return res
}
