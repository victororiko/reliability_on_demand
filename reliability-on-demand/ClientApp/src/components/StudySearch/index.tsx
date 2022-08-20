import React, { useEffect, useState } from "react"
import * as QueryString from "query-string"
import { Team } from "../Team"
import { CreateNewID, SimplifiedButtonType } from "../helpers/utils"
import { Pivots } from "../Pivots"
import { SearchByDropdown } from "./SearchByDropdown"
import { Loading } from "../helpers/Loading"
import { MyButton } from "../helpers/MyButton"

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

    const [searchBy, setSearchBy] = useState("")
    const [loading, setLoading] = useState(false)

    const callback_setTeamID = (selection_teamID: number) => {
        setTeamID(selection_teamID)
    }

    const callback_setSearchBy = (searchByStr: string) => {
        setSearchBy(searchByStr)
    }

    const handleSearchButtonCallback = (loadingFlag: boolean) => {
        const prevLoading = loading
        setLoading(!prevLoading)
    }

    return (
        <div>
            <h1>Search Studies</h1>
            <SearchByDropdown callback={callback_setSearchBy} />
            {searchBy.toLocaleLowerCase() === "team" ? (
                <Team
                    callback={callback_setTeamID}
                    queryStringParams={params}
                    showMoreDetails={false}
                    showTitle={false}
                />
            ) : searchBy.toLocaleLowerCase() === "pivots" ? (
                <Pivots StudyConfigID={CreateNewID} showSaveButton={false} />
            ) : (
                ""
            )}
            <MyButton
                callback={handleSearchButtonCallback}
                text="Search"
                buttonType={SimplifiedButtonType.Primary}
            />
            {loading ? <Loading message="Hang tight - getting your Studies" /> : ""}
        </div>
    )
}
