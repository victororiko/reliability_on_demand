import React from "react"
import { Loading } from "../../helpers/Loading"
import { MessageBox } from "../../helpers/MessageBox"
import { useStudyStatsQuery } from "../service"
import { StudyStatsTable } from "./StudyStatsTable"

interface IStudyStatsProps {
    StudyKeyInstanceGuidStr: string
}

export const StudyStats = (props: IStudyStatsProps) => {
    const { isError, error, isLoading, data } = useStudyStatsQuery(props.StudyKeyInstanceGuidStr)

    if (isError)
        return <MessageBox message={`Failed to get Study Stats. Internal error = ${error}`} />
    if (isLoading) return <Loading message="Hang tight - getting Study Stats" />

    return (
        <div>
            <h5>Study Statistics</h5>
            <StudyStatsTable data={data} />
        </div>
    )
}
