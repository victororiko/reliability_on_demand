import { StudyConfig } from "../../models/study.model"

export const getNameAndDate = (config: StudyConfig) => {
    return {
        "Study Name": config.StudyName,
        "Created Date": config.LastRefreshDate,
    }
}
