import React, { FormEvent, useEffect, useState } from "react"
import { Dropdown, IDropdownOption } from "@fluentui/react"

interface IMyDropdownProps {
    data: IDropdownOption[]
    enabled: boolean
    handleOptionChange: any
    label: string
    placeholder: string
    required: boolean
    selectedOption?: IDropdownOption
}

export const MyDropdown = (props: IMyDropdownProps) => {
    const [selectedItem, setSelectedItem] = useState<IDropdownOption | undefined>(
        props.selectedOption
    )
    const [options, setOptions] = useState(props.data)

    useEffect(() => {
        setOptions(props.data)
        setSelectedItem(props.selectedOption)
    }, [props])

    const onOptionChange = (event: FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        setSelectedItem(option)
        props.handleOptionChange(option)
    }
    return (
        <div>
            <Dropdown
                label={props.label}
                placeholder={props.placeholder}
                required={props.required}
                options={options}
                disabled={!props.enabled}
                onChange={onOptionChange}
                aria-label={props.label}
                selectedKey={selectedItem ? selectedItem.key : null} // null makes sure we display placeholder text by default
            />
        </div>
    )
}
