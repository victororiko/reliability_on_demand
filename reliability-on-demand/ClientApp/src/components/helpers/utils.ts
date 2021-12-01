/**
 * Used in Comboboxes or Dropdowns
 */
export interface KeyTextPair {
  /**
   * Arbitrary string associated with this option.
   */
  key: string | number
  /**
   * Text to render for this option
   */
  text: string
}

/**
 *
 * @param inputData any JSON that you get from backend
 * @param useKey 1 key that you want to extract e.g. "VerticalName" or "StudyId"
 * @param numericKey true: return object contains index as the key; false: return object contains string as the key
 * @returns an array of <Key,Text> Pairs that can be used as Options for Dropdowns or ComboBoxes
 */
export const convertToOptions = (
  inputData: any[],
  useKey: string,
  numericKey: boolean
): KeyTextPair[] => {
  let parsedList: KeyTextPair[] = []
  parsedList = inputData.map((item: any, index: number) => {
    if (numericKey) {
      return {
        key: index,
        text: item[useKey],
      }
    }
    return {
      key: item[useKey],
      text: item[useKey],
    }
  })
  return parsedList
}
