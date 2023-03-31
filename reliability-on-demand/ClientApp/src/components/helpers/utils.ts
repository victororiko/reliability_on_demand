import { IDropdownOption } from "@fluentui/react"
import { StudyPivotConfig } from "../../models/filterexpression.model"
import { Pivot } from "../../models/pivot.model"

/**
 * Used in Comboboxes or Dropdowns
 */
export interface KeyTextPair {
    /**
     * Arbitrary string associated with this option.
     */
    key: string
    /**
     * Text to render for this option
     */
    text: string
}

/**
 *
 * @param inputData any JSON that you get from backend
 * @param useKey 1 key that you want to extract e.g. "VerticalName" or "StudyConfigID"
 * @param numericKey true: return object contains index as the key; false: return object contains string as the key
 * @returns an array of <Key,Text> Pairs that can be used as Options for Dropdowns or ComboBoxes
 */
export const convertComplexTypeToOptions = (
    inputData: any[],
    useKey: string,
    useValue: string
): KeyTextPair[] => {
    const parsedList: KeyTextPair[] = []
    for (const element of inputData) {
        parsedList.push(convertObjectToOption(element, useKey, useValue))
    }
    return parsedList
}

/**
 *
 * @param inputData 1 object
 * @param useKey name of key to extract - you need to have this handy
 * @param useValue name of value to extract - you need to have this handy
 * @returns 1 Key/Text pair object that can be used in Comboboxes or Dropdowns
 */
export const convertObjectToOption = (
    inputData: any,
    useKey: string,
    useValue: string
): KeyTextPair => {
    return {
        key: inputData[useKey],
        text: inputData[useValue],
    }
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
// console.debug(unique); // ['a', 1, 2, '1']
export const onlyUnique = (myArray: any[]) => {
    return [...new Set(myArray)]
}

/**
 * Just saving some initialization values for previous and create
 */

export const CreateNewID = -1
export const DummyID = -2

export const EmptyFieldErrorMessage = "Empty Field"
export const SaveMessage = "Saved successfully!"
export const UnAuthorizedMessage =
    "Sorry - you are not authorized to view this page. Please reach out to cosreldata for help."

export const MAXNUMPIVOTSINCOMBOBOX = 4

export const PopulationSourceType = "PopulationSourceType"
export const AllSourceType = "All"

export const MinWidth = 200
export const MaxWidth = 250

export const myParseInt = (value: string): number => {
    return parseInt(value, 10)
}

export const prepUsageInMS = (timeInSec: number, timeInMin: number): number => {
    return timeInSec * 1000 + timeInMin * 60000
}

// Study Section hardcoded values
export const hardCodedFrequencies: IDropdownOption[] = [
    { key: 0, text: "none" },
    { key: 168, text: "weekly" },
    { key: 12, text: "every 12 hours" },
    { key: 24, text: "every 24 hours" },
    { key: 72, text: "every 3 days" },
]

// generate data for Dropdown
export const hardCodedObservationWindows: IDropdownOption[] = [
    { key: 0, text: "none" },
    { key: 14, text: "14 days" },
]

export const azureFuncURL = process.env.REACT_APP_ValidateFilterExpresionURL

export enum SimplifiedButtonType {
    Primary = 1,
    Other,
}

const minsToMS = (mins: number): number => {
    return mins * 60 * 1000
}

export const defaultOfSixtyMins = minsToMS(60)

export const emptyGuidStr = "00000000-0000-0000-0000-000000000000"

export const addSpaces = (str: string) => {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2")
}

export const wrapStyle = {
    whiteSpace: "normal",
    wordWrap: "break-word",
}

export const wrappedCellStyle = {
    ...wrapStyle,
    fontSize: 14,
}

export const wrappedHeaderStyle = {
    ...wrappedCellStyle,
    fontWeight: "bold",
}

// setting correct UIInputType for the newly added pivots in the Filter expression
export const setCorrectUIInputType = (
    filterExpData: StudyPivotConfig[],
    selectedPivotsWithCompleteInfo: Pivot[]
): StudyPivotConfig[] => {
    for (const row of filterExpData) {
        if (row.PivotScopeID === -1 && row.UIDataType?.length === 0) {
            for (const pivot of selectedPivotsWithCompleteInfo) {
                if (pivot.PivotKey === row.PivotKey && pivot.UIDataType?.length !== 0) {
                    row.UIDataType = pivot.UIDataType
                    break
                }
            }
        }
    }

    return filterExpData
}

// validates the user input
export const getErrorMessage = (controlValue: string, callback: any): string | undefined => {
    // To make the field editable for update as well.
    if (controlValue === "") {
        callback(controlValue)
        return EmptyFieldErrorMessage
    }
    return ""
}
