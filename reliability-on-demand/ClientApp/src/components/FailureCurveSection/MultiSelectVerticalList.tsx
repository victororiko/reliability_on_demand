import { Dropdown, IDropdownOption, TooltipHost } from "@fluentui/react"
import React, { useEffect } from "react"
import { Vertical } from "../../models/failurecurve.model"
import { getVerticalNames } from "./service"

interface Props {
    data: Vertical[]
    configuredverticals: Vertical[]
    callBack: any
}

export const MultiSelectVerticalList = (props: Props) => {
    // state
    const [selectedItems, setselectedItems] = React.useState<IDropdownOption[]>([])

    // populates the selecteditems object with the
    // configured verticals for the study for the first time
    const selectedKeyLogic = (configuredverticals: Vertical[]) => {
        const seletedUniqueKeys = new Set()
        const selectedKeys: string[] = []
        const selectedPairs: IDropdownOption[] = []
        let k: string = ""
        let pair: IDropdownOption

        if (configuredverticals && configuredverticals.length > 0) {
            for (const vertical of configuredverticals) {
                k = vertical.PivotSourceSubType.concat("_", vertical.VerticalName)
                if (!seletedUniqueKeys.has(k)) {
                    pair = {
                        key: k,
                        text: vertical.VerticalName,
                    }

                    selectedPairs.push(pair)
                    seletedUniqueKeys.add(k)
                    selectedKeys.push(k)
                }
            }
        }
        setselectedItems(selectedPairs)
    }

    const getSelectedKeyLogic = () => {
        const selectedKeys: string[] = []

        for (const p of selectedItems) {
            selectedKeys.push(p.key.toString())
        }

        return selectedKeys
    }

    const onChange = (
        _event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption,
        _index?: number
    ): void => {
        if (option) {
            const updated = option.selected
                ? [...(selectedItems ?? []), option as IDropdownOption]
                : selectedItems.filter((val) => {
                      return val.key !== option.key
                  })

            setselectedItems(updated)
            props.callBack(updated)
        }
    }

    // onMount
    useEffect(() => {
        selectedKeyLogic(props.configuredverticals)
    }, [props.configuredverticals])

    return (
        <div>
            <TooltipHost content="Select all the verticals you would like to configure for your study">
                <Dropdown
                    placeholder="Select all the verticals you would like to configure for your study"
                    label="Verticals List"
                    onChange={onChange}
                    multiSelect
                    options={getVerticalNames(props.data)}
                    selectedKeys={getSelectedKeyLogic()}
                />
            </TooltipHost>
        </div>
    )
}
