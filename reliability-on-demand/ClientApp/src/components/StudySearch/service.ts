import { StudyConfig } from "../../models/study.model"
import { onlyUnique } from "../helpers/utils"

export const getNameAndDate = (config: StudyConfig) => {
    return {
        "Study Name": config.StudyName,
        "Created Date": config.LastRefreshDate,
    }
}

export const getUniqueStudies = (studies: StudyConfig[]): StudyConfig[] => {
    const uniqueStudies: StudyConfig[] = []
    for (const study of studies) {
        const studyId = study.StudyConfigID
        const studyExists = uniqueStudies.find((s) => {
            return s.StudyConfigID === studyId
        })
        if (!studyExists) {
            uniqueStudies.push(study)
        }
    }
    return uniqueStudies
}
