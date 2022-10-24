import { IComboBoxOption } from "@fluentui/react/lib/components/ComboBox"
import {
    PopulationPivotConfig,
    PopulationPivotConfigUI,
    StudyPivotConfig
} from "../../models/filterexpression.model"
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
    for (const selection of selectedItems) {
        const foundConfig = allPopulationPivots.find((ele: PopulationPivotConfig) => {
            return selection.key === ele.PivotKey
        })
        if (foundConfig) {
            const customPopulationPivotConfig = {
                ...foundConfig,
                StudyConfigID: studyConfigID,
                PivotScopeID: foundConfig.PivotScopeID ? foundConfig.PivotScopeID : CreateNewID,
                AggregateBy: true,
                PivotSourceSubType: "AllMode",
                PivotScopeOperator: "",
            } as PopulationPivotConfig
            selectedPopulationPivotConfigs.push(customPopulationPivotConfig)
        }
    } // end for-of
    return selectedPopulationPivotConfigs
}

export const mergeLists = (
    userConfigs: PopulationPivotConfig[],
    allPopulationPivots: PopulationPivotConfig[]
): PopulationPivotConfig[] => {
    // use a set to make sure no duplicates are added as we merge the lists
    const set = new Set<PopulationPivotConfig>(userConfigs)
    for (const pivot of allPopulationPivots) {
        set.add(pivot)
    }
    const ans: PopulationPivotConfig[] = []
    for (const item of set) {
        ans.push(item)
    }
    return ans
}

export const parsePivotKey = (pivotKey: string): [string, string] => {
    if (pivotKey) {
        const underscorePosition = pivotKey.indexOf("_")
        const pivotSource = pivotKey.substring(0, underscorePosition)
        const pivotName = pivotKey.substring(underscorePosition + 1)
        return [pivotSource, pivotName]
    }
    // else assume pivotKey == null or undefined
    return ["no pivot source", "no pivot name"]
}

export const getPivotName = (pivotKey: string): string => {
    const [pivotSource, pivotName] = parsePivotKey(pivotKey)
    return pivotName
}

export const getAggregateByValue = (
    scopingCandidates: PopulationPivotConfigUI[],
    pws: StudyPivotConfig
): boolean => {
    let ans = false
    for (const item of scopingCandidates) {
        if (item.PivotKey === pws.PivotKey) {
            ans = item.AggregateBy
        }
    }
    return ans
}

export const getAggregateByCheckedValue = (
    scopingCandidates: PopulationPivotConfigUI[],
    pws: StudyPivotConfig
): boolean => {
    let ans = false
    for (const item of scopingCandidates) {
        if (item.PivotKey === pws.PivotKey) {
            ans = item.AggregateByChecked
        }
    }
    return ans
}

export const getScopeCheckedValue = (
    scopingCandidates: PopulationPivotConfigUI[],
    pws: StudyPivotConfig
): boolean => {
    let ans = false
    for (const item of scopingCandidates) {
        if (item.PivotKey === pws.PivotKey) {
            ans = item.ScopeByChecked
        }
    }
    return ans
}

export const old_mergeConfigsAndScopedConfigs = (
    unscopedPivots: PopulationPivotConfig[],
    scopedPivots: PopulationPivotConfig[]
): PopulationPivotConfig[] => {
    const ans: PopulationPivotConfig[] = []
    for (const unscoped of unscopedPivots) {
        const scoped = scopedPivots.find((item) => {
            return item.PivotKey === unscoped.PivotKey
        })
        if (scoped) ans.push(scoped)
        else ans.push(unscoped)
    }
    return ans
}

export const mergeScopesIntoConfigs = (
    unscopedPivots: PopulationPivotConfigUI[],
    scopedPivots: PopulationPivotConfigUI[]
): PopulationPivotConfigUI[] => {
    const ans: PopulationPivotConfigUI[] = []
    for (const unscoped of unscopedPivots) {
        const scoped = scopedPivots.find((item) => {
            return item.PivotKey === unscoped.PivotKey
        })
        if (scoped) ans.push(scoped)
        else ans.push(unscoped)
    }
    return ans
}

export const addNewScopeToConfig = (
    list: PopulationPivotConfigUI[],
    pws: StudyPivotConfig
): PopulationPivotConfigUI[] => {
    for (const item of list) {
        if (item.PivotKey === pws.PivotKey) {
            console.log(item)
        }
    }
    return list
}

export const reflectAggregateByCheckboxState = (
    list: PopulationPivotConfigUI[]
): PopulationPivotConfigUI[] => {
    const ans = list.map((item) => {
        return { ...item, AggregateBy: item.AggregateByChecked }
    })
    return ans
}

export const extractScopeByChecked = (
    list: PopulationPivotConfigUI[]
): PopulationPivotConfigUI[] => {
    const ans = list.filter((item) => {
        return item.ScopeByChecked === true
    })
    return ans
}

// pushes model state to checkboxes
export const pushModelToCheckBoxes = (
    configs: PopulationPivotConfig[]
): PopulationPivotConfigUI[] => {
    const ans: PopulationPivotConfigUI[] = configs as PopulationPivotConfigUI[]
    for (const item of ans) {
        item.AggregateByChecked = item.AggregateBy
        item.ScopeByChecked = item.PivotScopeID !== -1
    }
    return ans
}

export const updateFromChild = (
    list: PopulationPivotConfigUI[],
    configFromChild: PopulationPivotConfigUI
) => {
    for (const item of list) {
        if (item.PivotKey === configFromChild.PivotKey) {
            item.AggregateByChecked = configFromChild.AggregateByChecked
            item.ScopeByChecked = configFromChild.ScopeByChecked
        }
    }
    return list
}

export const pushAggByCheckboxToModel = (
    configs: PopulationPivotConfig[]
): PopulationPivotConfigUI[] => {
    // for each element push: AggregateByChecked value --> AggregateBy value
    const ans: PopulationPivotConfigUI[] = configs as PopulationPivotConfigUI[]
    for (const item of ans) {
        item.AggregateBy = item.AggregateByChecked
    }
    return ans
}

export const pushScopeByCheckboxToModel = (
    configs: PopulationPivotConfig[]
): PopulationPivotConfigUI[] => {
    // for each element push: AggregateByChecked value --> AggregateBy value
    const ans: PopulationPivotConfigUI[] = configs as PopulationPivotConfigUI[]
    for (const item of ans) {
        item.PivotScopeID = getPivotScopeID(item)
    }
    return ans
}

const getPivotScopeID = (config: PopulationPivotConfig): number => {
    if (config.PivotScopeID !== -1) return config.PivotScopeID
    return -1
}

export const sanitizeList = (input: PopulationPivotConfigUI[]): PopulationPivotConfigUI[] => {
    const ans: PopulationPivotConfigUI[] = []
    for (const item of input) {
        // make sure we have only valid pivot entries
        if (item.AggregateByChecked || item.ScopeByChecked) {
            // make sure scopes are set properly
            item.PivotScopeID = item.ScopeByChecked ? item.PivotScopeID : -1
            ans.push(item)
        }
    }
    return ans
}

export const debugList = (input: PopulationPivotConfigUI[]) => {
    const limitedObj = input.map((item) => {
        const rObj = {
            Pivot: getPivotName(item.PivotKey),
            AggCheck: item.AggregateByChecked,
            AggregateBy: item.AggregateBy,
            ScopeCheck: item.ScopeByChecked,
            PivotScopeID: item.PivotScopeID,
            PivotOperator: item.PivotOperator,
            PivotScopeValue: item.PivotScopeValue,
            StudyConfigID: item.StudyConfigID,
            RelationalOperator: item.RelationalOperator,
        }
        return rObj
    })
    console.clear()
    console.table(limitedObj)
}
