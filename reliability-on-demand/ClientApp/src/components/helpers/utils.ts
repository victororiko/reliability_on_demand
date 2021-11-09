/**
 * replacer function that can catch circular objects, and allow JSON.stringy to print circular objects
 * @returns function to be used in JSON.stringify()
 */
export const replacerFunc = () => {
  const visited = new WeakSet()
  return (key: any, value: object | null) => {
    if (typeof value === 'object' && value !== null) {
      if (visited.has(value)) {
        return
      }
      visited.add(value)
    }
    return value
  }
}

/**
 * Used in Comboboxes or Dropdowns
 */
interface KeyTextPair {
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
  let parsedList: KeyTextPair[]
  parsedList = inputData.map((item: any, index: number) => {
    if (numericKey) {
      return {
        key: index,
        text: item[useKey],
      }
    } else {
      return {
        key: item[useKey],
        text: item[useKey],
      }
    }
  })
  return parsedList
}
