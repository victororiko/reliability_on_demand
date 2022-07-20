import { buildColumns, IColumn, IDropdownOption } from '@fluentui/react'
import {
  FilterExpTable,
  Pivot,
  PivotScopeFilter,
  PivotSQLResult,
  PivotTable,
  Vertical,
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
    key: item.PivotID,
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
      ele.fieldName !== 'UIInputDataType' &&
      ele.fieldName !== 'PivotKey'
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
      PivotKey: ele.PivotKey,
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
      let pivotkey = ''
      for (const element of input) {
        if (element.PivotID === ele) {
          name = element.PivotSourceColumnName
          tobeAddedePivotDataType = element.UIInputDataType
          pivotkey = element.PivotKey
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
        PivotKey: pivotkey,
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
export const loadFilterExpressionTable = (
  input: PivotTable[]
): FilterExpTable[] => {
  const res: FilterExpTable[] = []

  for (const ele of input) {
    if (ele.IsScopeFilter === true) {
      const exp = ele.FilterExpression

      if (exp !== null && exp !== '') {
        for (const eleExp of exp.split(ele.PivotName)) {
          if (eleExp !== null && eleExp !== '') {
            // First find which relational operator is contained in the filter expression
            const rop = getContainingElementFromArr(
              eleExp,
              loadRelationalOperators()
            )

            let ropArr: string[] = []

            // Split the array based on the relational operator it contains
            if (typeof rop !== 'undefined' && rop !== '')
              ropArr = eleExp.split(rop ?? '')
            else ropArr[0] = eleExp

            let ropArrPtr = 0

            for (const eleRop of ropArr) {
              const trimele = eleRop.trim()
              if (trimele !== null && trimele !== '') {
                // Check which logical operator does the filter expression contains
                const op = getContainingElementFromArr(trimele, loadOperators())
                const val = trimele.split(op ?? '')[1].trim()

                if (ropArrPtr === ropArr.length - 1)
                  res.push({
                    PivotID: ele.PivotID,
                    PivotName: ele.PivotName,
                    PivotValue: val,
                    PivotScopeID: ele.PivotScopeID,
                    Operator: op ?? '',
                    RelationalOperator: ele.FilterExpressionOperator,
                    UIInputDataType: ele.UIInputDataType,
                    PivotKey: ele.PivotKey,
                  })
                else
                  res.push({
                    PivotID: ele.PivotID,
                    PivotName: ele.PivotName,
                    PivotValue: val,
                    PivotScopeID: ele.PivotScopeID,
                    Operator: op ?? '',
                    RelationalOperator: rop ?? '',
                    UIInputDataType: ele.UIInputDataType,
                    PivotKey: ele.PivotKey,
                  })
              }

              ropArrPtr += 1
            }
          }
        }
      }
    }
  }

  if (res === null || res.length === 0)
    res.push({
      PivotID: 0,
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
      return d.PivotID.toString()
    }
  }

  return ''
}

// get all the pivots selected for filter expression
export const getAllFilteredPivots = (
  input: PivotTable[]
): IDropdownOption[] => {
  const pivotsToFilter: IDropdownOption[] = []
  for (const ele of input) {
    if (ele.IsScopeFilter === true) {
      pivotsToFilter.push({
        key: ele.PivotID.toString(),
        text: ele.PivotName,
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
    case 'PivotID':
      FilterExpTableTemp[row].PivotID = val
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

/* This function reduces the inputs provided using filter expression UI by the user into one filter expression per pivot
 * followed by updating the filter expression and the relational operator for each pivot in the failureconfig variable.
 * Finally passes the object to the save component for saving the data.
 */
export const getFailureCurvePivotsToSave = (
  filterExpTable: FilterExpTable[],
  pivots: PivotTable[]
): PivotTable[] => {
  const pivotexpMap = getWrappedPivotScopeFilterByExpTable(filterExpTable)
  const res = pivots

  // Updating the obj with the new filter expression and operator provided by the end user using UI
  for (const ele of pivotexpMap) {
    const pid = Number(ele.PivotID)
    for (let i = 0; i < pivots.length; i++) {
      const id = Number(res[i].PivotID)
      if (pid === id) {
        res[i].FilterExpression = ele.FilterExpression
        res[i].FilterExpressionOperator = ele.RelationalOperator
        break
      }
    }
  }

  // setting the filterexpression to '' in case of delete and pivotscopeid to null
  for (let i = 0; i < pivots.length; i++) {
    const pivotscopeid = res[i].PivotScopeID
    const pid = res[i].PivotID

    if (pivotscopeid !== null && pivotscopeid !== 0) {
      let flag = false
      for (const ele of pivotexpMap) {
        if (pid === ele.PivotID) {
          flag = true
          break
        }
      }

      if (flag === false) {
        res[i].FilterExpression = ''
        res[i].FilterExpressionOperator = ''
        res[i].PivotScopeID = 0
      }
    }
  }

  // Setting pivotscopeid to 0 instead of null so that it doesn't cause any error while passing to data controller
  for (let i = 0; i < pivots.length; i++) {
    if (res[i].PivotScopeID === null) res[i].PivotScopeID = 0
  }

  return res
}

// convert filter expression table to PivotScopeFilter object
export const getWrappedPivotScopeFilterByExpTable = (
  DefaultPivot: FilterExpTable[]
): PivotScopeFilter[] => {
  let DefaultPivotPtr = 0
  const pivotexpMap: PivotScopeFilter[] = []
  // Iterating over all the rows provided by the filter expression UI and reducing them to one for each pivot
  for (const d of DefaultPivot) {
    const pid = d.PivotID
    let flag = false

    for (let i = 0; i < pivotexpMap.length; i++) {
      const id = pivotexpMap[i].PivotID

      if (Number(pid) === Number(id)) {
        const filterexp = pivotexpMap[i].FilterExpression
        const exp = `${filterexp} ${pivotexpMap[i].RelationalOperator} ${d.PivotName} ${d.Operator} ${d.PivotValue}`
        const rop = d.RelationalOperator
        pivotexpMap[i].FilterExpression = exp
        pivotexpMap[i].RelationalOperator = rop
        flag = true
        break
      }
    }

    if (flag === false) {
      const filterexp = `${d.PivotName} ${d.Operator} ${d.PivotValue}`
      pivotexpMap.push({
        PivotID: Number(d.PivotID),
        FilterExpression: filterexp,
        RelationalOperator: d.RelationalOperator,
        PivotKey: d.PivotKey,
      })
    }

    if (DefaultPivotPtr === DefaultPivot.length - 1) {
      pivotexpMap[pivotexpMap.length - 1].RelationalOperator = ''
    }

    DefaultPivotPtr += 1
  }

  return pivotexpMap
}
