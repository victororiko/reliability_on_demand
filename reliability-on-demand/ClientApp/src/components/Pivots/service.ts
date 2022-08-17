import { IComboBoxOption } from "@fluentui/react/lib/components/ComboBox"
import { PopulationPivotConfig } from "../../models/filterexpression.model"
import { CreateNewID } from "../helpers/utils"

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

export const convertPivotInfoToOptions = (inputData: any, pivotSource: string) => {
    let parsedList: IComboBoxOption[] = []
    if (inputData) {
        const filtered = inputData.filter((item: any) => {
            return item.PivotSource === pivotSource
        })
        parsedList = filtered.map((item: any) => {
            const rObj = {
                key: item.PivotKey,
                text: item.PivotName,
            }
            return rObj
        })
    }
    return parsedList
}

// for each selectedItem --> return its corresponding pouplation pivot
export const generateCorrespondingStudyConfig = (
    selectedItems: IComboBoxOption[],
    allPopulationPivots: PopulationPivotConfig[],
    studyConfigID: number
): PopulationPivotConfig[] => {
    const selectedPopulationPivotConfigs: PopulationPivotConfig[] = []
    for (const item of selectedItems) {
        const foundConfig = allPopulationPivots.find((ele: PopulationPivotConfig) => {
            return item.key === ele.PivotKey
        })
        if (foundConfig) {
            const customPopulationPivotConfig = {
                PivotKey: foundConfig.PivotKey,
                StudyConfigID: studyConfigID,
                PivotScopeID: CreateNewID,
                AggregateBy: true,
                PivotSourceSubType: "AllMode",
                PivotScopeOperator: "",
            } as PopulationPivotConfig
            selectedPopulationPivotConfigs.push(customPopulationPivotConfig)
        }
    } // end for-of
    return selectedPopulationPivotConfigs
}
