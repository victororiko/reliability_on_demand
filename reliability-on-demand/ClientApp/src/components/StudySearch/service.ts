import { StudyConfig } from "../../models/study.model"

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
