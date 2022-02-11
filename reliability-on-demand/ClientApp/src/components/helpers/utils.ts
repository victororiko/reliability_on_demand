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
export const convertComplexTypeToOptions = (
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

/**
 *
 * @param inputData any array of primitives like number or string
 * @param numericKey whether to use a number as key in the returned list
 * @returns returns a list of <Key/Text> Pair that can be used in Dropdowns
 */
export const convertSimpleTypeToOptions = (
  inputData: any[],
  numericKey: boolean
): KeyTextPair[] => {
  let parsedList: KeyTextPair[] = []
  parsedList = inputData.map((item: any, index: number) => {
    if (numericKey) {
      return {
        key: index,
        text: item.toString(),
      }
    }
    return {
      key: item.toString(),
      text: item.toString(),
    }
  })
  return parsedList
}

// usage example:
// var a = ['a', 1, 'a', 2, '1'];
// var unique = a.filter(onlyUnique);
// console.log(unique); // ['a', 1, 2, '1']
export const onlyUnique = (myArray: any[]) => {
  return [...new Set(myArray)]
}


/**
 * Just saving some initialization values for previous and create
 */

export const CreateNewID = -1;
export const DummyID = -2;
