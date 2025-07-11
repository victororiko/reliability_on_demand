import { Pivot, PivotItem } from "@fluentui/react"
import * as React from "react"
import { ManagePivots } from "./ManagePivots"
import { ManageTeam } from "./ManageTeam"
import { ManageVerticals } from "./ManageVerticals"
import { ManageFailureVerticals } from "./ManageFailureVerticals/ManageFailureVerticals"

export interface IMenuPivotsProps {}

// Admin Menu Page
export const MenuPivots = (props: IMenuPivotsProps) => {
    return (
        <Pivot aria-label="Admin Menu">
            <PivotItem headerText="Manage Team">
                <ManageTeam />
            </PivotItem>
            <PivotItem headerText="Modify Default Pivots">
                <ManagePivots />
            </PivotItem>
            <PivotItem headerText="Modify Default Verticals">
                <ManageVerticals />
            </PivotItem>
            <PivotItem headerText="Modify Verticals">
                <ManageFailureVerticals />
            </PivotItem>
        </Pivot>
    )
}
