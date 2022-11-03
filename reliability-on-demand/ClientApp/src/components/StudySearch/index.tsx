import axios from "axios"
import * as QueryString from "query-string"
import React, { useEffect, useState } from "react"
import { StudyConfig } from "../../models/study.model"
import { Loading } from "../helpers/Loading"
import { MyButton } from "../helpers/MyButton"
import { CreateNewID, SimplifiedButtonType } from "../helpers/utils"
import { Pivots } from "../Pivots"
import { Team } from "../Team"
import { SearchByDropdown } from "./SearchByDropdown"
import { StudyConfigList } from "./StudyConfigList"

interface IStudySearchProps {
    location: any
}

export const StudySearch = (props: IStudySearchProps) => {
    // query string parsing
    const params = QueryString.parse(props.location.search)

    // state
    const [teamID, setTeamID] = useState(CreateNewID)
    // update this page with teamID if it exists
    useEffect(() => {}, [props])

    const [studyConfigs, setStudyConfigs] = useState<StudyConfig[]>([])
    const [searchBy, setSearchBy] = useState("")
    const [loading, setLoading] = useState(false)
    const [studyConfigsLoaded, setStudyConfigsLoaded] = useState(false)

    const setTeamIdFromSelection = (selection_teamID: number) => {
        setTeamID(selection_teamID)
    }

    const setSearchByFromSelection = (searchByStr: string) => {
        setSearchBy(searchByStr)
    }

    const loadStudies = () => {
        setLoading(true)
        axios.get(`api/Data/GetStudies/${teamID}`).then((res) => {
            if (res) setStudyConfigs(res.data as StudyConfig[])
            else setStudyConfigs([])
            setLoading(false)
            setStudyConfigsLoaded(true)
        })
    }

    const renderStudyConfigs = studyConfigsLoaded ? (
        <div>
            <StudyConfigList studyConfigs={studyConfigs} />
        </div>
    ) : (
        "No Studies Found"
    )

    return (
        <div>
            <h1>Search Studies</h1>
            <SearchByDropdown callback={setSearchByFromSelection} />
            {searchBy === "Team" ? (
                <Team
                    callback={setTeamIdFromSelection}
                    queryStringParams={params}
                    showMoreDetails={false}
                    showTitle={false}
                />
            ) : searchBy === "Pivots" ? (
                <Pivots StudyConfigID={CreateNewID} showSaveButton={false} />
            ) : (
                ""
            )}
            <MyButton
                callback={loadStudies}
                text="Search"
                buttonType={SimplifiedButtonType.Primary}
            />
            {loading ? <Loading message="Hang tight - getting your Studies" /> : ""}
            {renderStudyConfigs}
        </div>
    )
}
