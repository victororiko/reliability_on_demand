import { IComboBoxOption, IDropdownOption } from "@fluentui/react"

export interface StudyConfig {
    StudyConfigID: string
    StudyName: string
    LastRefreshDate: Date
    CacheFrequency: number
    Expiry: Date
    TeamID: number
    ObservationWindowDays: number
}

export const convertToOptions = (inputData: StudyConfig[]) => {
    let parsedList: IComboBoxOption[] = []
    if (inputData) {
        parsedList = inputData.map((item) => {
            const rObj = {
                key: item.StudyConfigID.toString(),
                text: item.StudyName,
            }
            return rObj
        })
    }
    // -1 is used as key for the new study to just identify in the code whether user wants to add a study or update an existing study
    parsedList.push({
        key: "-1",
        text: "create new study",
    })
    return parsedList
}

export const getStudyConfig = (
    studies: StudyConfig[],
    key: string | number
): StudyConfig | undefined => {
    const ans = studies.find((item) => {
        return item.StudyConfigID.toString() === key
    })
    if (ans) return ans
    return undefined
}

export const getFrequencySelectionFromStudy = (
    data: IDropdownOption[],
    selectedStudy: StudyConfig | undefined
): IDropdownOption | undefined => {
    return data.find((item) => {
        return item.key === selectedStudy?.CacheFrequency
    })
}

export const getDefaultExpiryDate = () => {
    // set default expiry to 3 months from now
    const now = new Date()
    const current = new Date(now.getFullYear(), now.getMonth() + 3, now.getDay())
    return current
}

export const getObservationWindowSelectionFromStudy = (
    data: IDropdownOption[],
    selectedStudy: StudyConfig | undefined
): IDropdownOption | undefined => {
    return data.find((item) => {
        return item.key === selectedStudy?.ObservationWindowDays
    })
}
