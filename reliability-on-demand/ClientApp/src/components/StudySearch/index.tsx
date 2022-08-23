import React, { useEffect, useState } from "react"
import * as QueryString from "query-string"
import axios from "axios"
import { Team } from "../Team"
import { CreateNewID, SimplifiedButtonType } from "../helpers/utils"
import { Pivots } from "../Pivots"
import { SearchByDropdown } from "./SearchByDropdown"
import { Loading } from "../helpers/Loading"
import { MyButton } from "../helpers/MyButton"
import { StudyConfig } from "../../models/study.model"
import { MessageBox } from "../helpers/MessageBox"

interface IStudySearchProps {
    location: any
}

export const StudySearch = (props: IStudySearchProps) => {
    // query string parsing
    const params = QueryString.parse(props.location.search)

    // state
    const [teamID, setTeamID] = useState(CreateNewID)
    // update this page with teamID if it exists
    useEffect(() => {
        console.log(`teamID = ${teamID}`)
    }, [props])

    const [studyConfigs, setStudyConfigs] = useState<StudyConfig[]>([])

    const [searchBy, setSearchBy] = useState("")
    const [loading, setLoading] = useState(false)
    const [studyConfigsLoaded, setStudyConfigsLoaded] = useState(false)

    const callback_setTeamID = (selection_teamID: number) => {
        setTeamID(selection_teamID)
    }

    const callback_setSearchBy = (searchByStr: string) => {
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

    return (
        <div>
            <h1>Search Studies</h1>
            <SearchByDropdown callback={callback_setSearchBy} />
            {searchBy === "Team" ? (
                <Team
                    callback={callback_setTeamID}
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
            {studyConfigsLoaded ? <MessageBox message={studyConfigs} isJSON /> : "No Studies Found"}
        </div>
    )
}
