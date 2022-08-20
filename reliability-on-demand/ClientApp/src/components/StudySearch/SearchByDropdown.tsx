import { IDropdownOption } from "@fluentui/react"
import React from "react"
import { MySingleSelectComboBox } from "../helpers/MySingleSelectComboBox"

interface ISearchByDropdownProps {
    callback: any
}

export const SearchByDropdown = (props: ISearchByDropdownProps) => {
    const handleUserSelection = (userSelection: IDropdownOption) => {
        props.callback(userSelection.key)
    }
    return (
        <div>
            <MySingleSelectComboBox
                options={options}
                callback={handleUserSelection}
                label="Search By"
                placeholder="Select a way to search for studies"
                selectedItem={undefined}
            />
        </div>
    )
}

const options: IDropdownOption[] = [
    {
        key: "Team",
        text: "Team",
    },
    {
        key: "Pivots",
        text: "Pivots",
    },
]
