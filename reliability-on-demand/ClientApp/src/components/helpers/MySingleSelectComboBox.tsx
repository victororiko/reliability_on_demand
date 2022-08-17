import { IComboBox, IComboBoxOption, VirtualizedComboBox } from "@fluentui/react"
import React, { FormEvent, useEffect, useState } from "react"
/**
 * Responsibilities:
 * 1. Render options, and selected item
 * 2. When selected item changes: re-render to update that selection OR show default (empty) selection
 *
 * @param props attribute that will determine the behavior of combobox
 * @returns ComboBox component that renders options, and handles user selections
 */
interface Props {
    options: IComboBoxOption[]
    callback: any
    label: string
    placeholder: string
    selectedItem: IComboBoxOption | undefined
}

export const MySingleSelectComboBox = (props: Props) => {
    const [selectedItem, setSelectedItem] = useState<IComboBoxOption | null>(null)

    useEffect(() => {
        if (props.selectedItem === undefined) setSelectedItem(null)
        // force combobox to show placeholder text by default
        else setSelectedItem(props.selectedItem)
    }, [props.selectedItem])

    const handleChange = (
        event: FormEvent<IComboBox>,
        option?: IComboBoxOption | undefined,
        index?: number | undefined,
        value?: string | undefined
    ) => {
        if (option !== undefined) {
            setSelectedItem(option)
            props.callback(option)
        }
    }

    return (
        <div>
            <VirtualizedComboBox
                label={props.label}
                selectedKey={selectedItem?.key || null}
                options={props.options}
                onChange={handleChange}
                allowFreeform
                autoComplete="on"
                useComboBoxAsMenuWidth
                placeholder={props.placeholder}
            />
        </div>
    )
}
