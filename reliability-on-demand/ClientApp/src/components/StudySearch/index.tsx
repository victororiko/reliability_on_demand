import React, { useState } from "react"
import * as QueryString from "query-string"
import { Team } from "../Team"
import { CreateNewID } from "../helpers/utils"

interface IStudySearchProps { 
    location:any
}

export const StudySearch = (props: IStudySearchProps) => {
    // query string parsing
    const params = QueryString.parse(props.location.search)

    // state
    const [teamID, setTeamID] = useState(CreateNewID)
    
    const callback_setTeamID = (selection_teamID: number) => {
        setTeamID(selection_teamID)
        console.log(`old teamID = ${teamID}`)
        console.log(`new teamID = ${selection_teamID}`)
    }

    return (
        <div>
            <h1>Search Studies</h1>
            <Team callback={callback_setTeamID} queryStringParams={params} />
            
        </div>
    )
}
