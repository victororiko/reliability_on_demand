import { PrimaryButton } from "@fluentui/react"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Container } from "reactstrap"
import { PopulationPivotConfigUI } from "../../models/filterexpression.model"
import { StudyConfig } from "../../models/study.model"
import { Loading } from "../helpers/Loading"
import { MessageBox } from "../helpers/MessageBox"
import { CreateNewID } from "../helpers/utils"
import { Pivots } from "../Pivots"
import { Team } from "../Team"
import { SearchByDropdown } from "./SearchByDropdown"
import { getUniqueStudies } from "./service"
import { StudyConfigList } from "./StudyConfigList"

interface IStudySearchProps {}

export const StudySearch = (props: IStudySearchProps) => {
    // state
    const [teamID, setTeamID] = useState(CreateNewID)
    // update this page with teamID if it exists
    useEffect(() => {}, [props])

    const [studyConfigs, setStudyConfigs] = useState<StudyConfig[]>([])
    const [searchBy, setSearchBy] = useState("")
    const [loading, setLoading] = useState(false)
    const [studyConfigsLoaded, setStudyConfigsLoaded] = useState(false)
    const [pivotConfigs, setPivotConfigs] = useState<PopulationPivotConfigUI[]>([])

    const setTeamIdFromSelection = (selection_teamID: number) => {
        setTeamID(selection_teamID)
    }

    const setSearchByFromSelection = (searchByStr: string) => {
        setSearchBy(searchByStr)
    }

    const loadStudies = () => {
        setLoading(true)
        setStudyConfigsLoaded(false)
        if (searchBy === "Team") {
            axios.get(`api/Data/GetStudies/${teamID}`).then((res) => {
                if (res) setStudyConfigs(res.data as StudyConfig[])
                else setStudyConfigs([])
                setLoading(false)
                setStudyConfigsLoaded(true)
            })
        } else if (searchBy === "Pivots") {
            axios
                .post(`api/Data/GetStudyConfigIDsForPivotsAndScopes/`, pivotConfigs)
                .then((res) => {
                    if (res) {
                        const studies = res.data as StudyConfig[]
                        const uniqueStudies = getUniqueStudies(studies)
                        setStudyConfigs(uniqueStudies as StudyConfig[])
                    } else setStudyConfigs([])
                    setLoading(false)
                    setStudyConfigsLoaded(true)
                })
        } else {
            console.error("please set a search by term")
        }
        setLoading(false)
    }

    const renderSearchButton =
        searchBy === "" ? (
            ""
        ) : searchBy === "Team" ? (
            <PrimaryButton text="Search" onClick={loadStudies} />
        ) : searchBy === "Pivots" && pivotConfigs.length > 0 ? (
            <PrimaryButton text="Search" onClick={loadStudies} />
        ) : (
            ""
        )

    const renderStudyConfigs = studyConfigsLoaded ? (
        studyConfigs.length > 0 ? (
            <StudyConfigList studyConfigs={studyConfigs} />
        ) : (
            <MessageBox message="No Studies Found" />
        )
    ) : (
        ""
    )

    // callbacks
    const handlePivotConfigs = (studyPivotConfigs: PopulationPivotConfigUI[]) => {
        setPivotConfigs(studyPivotConfigs)
    }

    return (
        <Container>
            <h1>Search Studies</h1>
            <SearchByDropdown callback={setSearchByFromSelection} />
            {searchBy === "Team" ? (
                <Team callback={setTeamIdFromSelection} showMoreDetails={false} showTitle={false} />
            ) : searchBy === "Pivots" ? (
                <Pivots
                    StudyConfigID={CreateNewID}
                    showSaveButton={false}
                    captureStudyPivotConfigs={handlePivotConfigs}
                />
            ) : (
                ""
            )}
            {renderSearchButton}
            {loading ? <Loading message="Hang tight - getting your Studies" /> : ""}
            {renderStudyConfigs}
        </Container>
    )
}
