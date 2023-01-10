import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import queryString from "query-string"
import React from "react"
import { StudyInstanceData } from "../../models/study.model"
import { Loading } from "../helpers/Loading"
import { MessageBox } from "../helpers/MessageBox"
import { CreateNewID } from "../helpers/utils"
import { RichStudyInstanceTable } from "./RichStudyInstanceTable"

interface IStudyInstanceProps {}

export const StudyInstance = (props: IStudyInstanceProps) => {
    // parse StudyConfigID from query string if it exists
    let studyConfigId = CreateNewID
    const { StudyConfigID } = queryString.parse(location.search, { parseNumbers: true })
    if (StudyConfigID) studyConfigId = StudyConfigID as number

    const { isError, error, isLoading, data } = useQuery({
        queryKey: ["products"],
        queryFn: () => {
            return axios.get(`api/Data/GetStudyInstances/${studyConfigId}`).then((res) => {
                return res.data
            })
        },
    })

    if (isError)
        return <MessageBox message={`Failed to get StudyInstances. Internal error = ${error}`} />
    if (isLoading) return <Loading message="Hang tight - getting Study Instances" />

    return (
        <div>
            <RichStudyInstanceTable data={data as StudyInstanceData[]} />
        </div>
    )
}
