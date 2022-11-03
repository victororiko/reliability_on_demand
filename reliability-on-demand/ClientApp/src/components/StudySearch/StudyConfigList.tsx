import React from "react"
import { StudyConfig } from "../../models/study.model"
import { StudyConfigHeader } from "./StudyConfigHeader"
import { StudyConfigRow } from "./StudyConfigRow"

interface IStudyConfigListProps {
    studyConfigs: StudyConfig[]
}

export const StudyConfigList = (props: IStudyConfigListProps) => {
    return (
        <div>
            <StudyConfigHeader />
            {props.studyConfigs.map((config: StudyConfig) => {
                return <StudyConfigRow config={config} key={config.HashString} />
            })}
        </div>
    )
}
