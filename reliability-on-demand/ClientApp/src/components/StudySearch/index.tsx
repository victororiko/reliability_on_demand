import React, { useState } from "react"
import * as QueryString from "query-string"
import { Team } from "../Team"
import { CreateNewID } from "../helpers/utils"
import { Pivots } from "../Pivots"
import { SearchByDropdown } from "./SearchByDropdown"

interface IStudySearchProps {
    location: any
}

export const StudySearch = (props: IStudySearchProps) => {
    // query string parsing
    const params = QueryString.parse(props.location.search)

    // state
    const [teamID, setTeamID] = useState(CreateNewID)
    const [searchBy, setSearchBy] = useState("")
    const callback_setTeamID = (selection_teamID: number) => {
        setTeamID(selection_teamID)
    }

    const callback_setSearchBy = (searchByStr: string) => {
        setSearchBy(searchByStr)
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
        </div>
    )
}
