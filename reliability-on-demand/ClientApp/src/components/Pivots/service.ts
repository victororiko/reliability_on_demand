import { IComboBoxOption } from '@fluentui/react/lib/components/ComboBox'

export const convertPivotSourceToOptions = (inputData: any) => {
  let parsedList: IComboBoxOption[] = []
  if (inputData) {
    parsedList = inputData.map((item: any) => {
      const rObj = {
        key: item.PivotSource,
        text: item.PivotSource,
      }
      return rObj
    })
  }
  return parsedList
}

export const convertPivotInfoToOptions = (
  inputData: any,
  pivotSource: string
) => {
  let parsedList: IComboBoxOption[] = []
  if (inputData)
    parsedList = inputData
      .filter((item: any) => {
        return item.PivotSource === pivotSource
      })
      .map((item: any) => {
        const rObj = {
          key: item.PivotKey,
          text: item.PivotName,
        }
        return rObj
      })
  return parsedList
}
