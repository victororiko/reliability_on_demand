import { TextField } from "@fluentui/react"
import React from "react"
import { TeamConfig } from "../../models/team.model"

interface IOwnerTeamFriendlyNameProps {
    currentTeam?: TeamConfig
}

export const OwnerTeamFriendlyName = (props: IOwnerTeamFriendlyNameProps) => {
    return (
        <div>
            <TextField
                label="Owner Team Friendly Name"
                placeholder="e.g. Client FUN Engineering Team"
                aria-label="Owner contact (alias)"
                disabled={props.currentTeam !== undefined}
                value={props.currentTeam ? props.currentTeam.OwnerTeamFriendlyName : "empty"}
            />
        </div>
    )
}
