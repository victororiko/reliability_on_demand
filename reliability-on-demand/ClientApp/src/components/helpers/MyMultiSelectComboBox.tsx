import { IComboBoxOption } from "@fluentui/react"
import { Autocomplete, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"

interface IMyMultiSelectComboBoxProps {
    options: IComboBoxOption[]
    callback: any
    label: string
    placeholder: string
    selectedItems: IComboBoxOption[] // make sure you pass in empty array if no selections exist
}

export const MyMultiSelectComboBox = (props: IMyMultiSelectComboBoxProps) => {
    const [selectedItems, setSelectedItems] = useState<IComboBoxOption[]>([])
    const optionsWithSelection = props.options.map((option) => {
        const foundUserPivot = selectedItems.find((item) => {
            return item.key === option.key
        })
        if (foundUserPivot)
            return {
                ...option,
                selected: true,
            }
        return { ...option }
    })

    useEffect(() => {
        setSelectedItems(props.selectedItems) // force combobox to show placeholder text if no selections exist
    }, [props.selectedItems])

    // call this whenever user selects an item
    const handleChange = (option?: IComboBoxOption[] | undefined) => {
        console.log(option)
        if (option !== undefined) {
            props.callback(
                option.map((item) => {
                    return { ...item, selected: true }
                })
            )
            // if option has already been selected - remove it from selectedItems
            // if (
            //     selectedItems.find((item) => {
            //         return item.key === option.key
            //     })
            // ) {
            //     const newList = selectedItems.filter((item) => {
            //         return item.key !== option.key
            //     })
            //     setSelectedItems(newList)
            //     props.callback(newList)
            // }
            // // add thd new selection to list of existing selections
            // else {
            //     const concatenatedList = [...selectedItems, option]
            //     setSelectedItems(concatenatedList)
            //     props.callback(concatenatedList)
            // }
        }
    }

    return (
        <div>
            <br />
            {optionsWithSelection.length > 0 && (
                <Autocomplete
                    isOptionEqualToValue={(option, value) => {
                        return option.key === value.key
                    }}
                    multiple
                    id="tags-standard"
                    options={props.options}
                    getOptionLabel={(option) => {
                        return option.text
                    }}
                    value={selectedItems}
                    onChange={(event, newSelections) => {
                        setSelectedItems(newSelections)
                        props.callback(newSelections)
                    }}
                    renderInput={(params) => {
                        return (
                            <TextField
                                {...params}
                                variant="standard"
                                label={props.label}
                                placeholder={props.placeholder}
                            />
                        )
                    }}
                />
            )}
        </div>
    )
}
