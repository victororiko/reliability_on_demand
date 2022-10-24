import { Checkbox, Stack, Text } from "@fluentui/react"
import React, { useEffect, useState } from "react"
import { PopulationPivotConfigUI } from "../../models/filterexpression.model"
import { MessageBox } from "../helpers/MessageBox"
import { horizontalStackTokens } from "../helpers/Styles"
import { getPivotName } from "./service"

interface IPivotConfigListRowProps {
    config: PopulationPivotConfigUI
    updateConfig: any
}
const fixedWidth300px = {
    root: { width: "300px;" },
}

export const PivotConfigListRow = (props: IPivotConfigListRowProps) => {
    // capture old value for PivotScopeID once when this component is mounted
    const [configInstance, setConfigInstance] = useState<PopulationPivotConfigUI>(props.config)

    useEffect(() => {
        setConfigInstance(props.config)
    }, [])

    const bothUnchecked = (): boolean => {
        return (
            configInstance.AggregateByChecked === false && configInstance.ScopeByChecked === false
        )
    }

    const setAggregateBy = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        isChecked?: boolean
    ) => {
        if (isChecked !== undefined) {
            // update aggregate by flag
            const b = configInstance
            b.AggregateByChecked = isChecked
            setConfigInstance(b)
            // pass updated object to parent
            props.updateConfig(b)
        }
    }

    const setScopeBy = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        isChecked?: boolean
    ) => {
        if (isChecked !== undefined) {
            // update aggregate by flag
            const c = configInstance
            c.ScopeByChecked = isChecked
            setConfigInstance(c)
            // pass updated object to parent
            props.updateConfig(c)
        }
    }

    return (
        <div>
            <Stack horizontal tokens={horizontalStackTokens}>
                <Text styles={fixedWidth300px}>{getPivotName(props.config.PivotKey)}</Text>

                <Checkbox
                    label="Aggregate By"
                    defaultChecked={configInstance.AggregateByChecked}
                    onChange={setAggregateBy}
                    id={props.config.PivotKey}
                />

                <Checkbox
                    label="Scope"
                    defaultChecked={configInstance.ScopeByChecked}
                    onChange={setScopeBy}
                />

                {bothUnchecked() ? (
                    // TODO - add error message bar here https://developer.microsoft.com/en-us/fluentui#/controls/web/messagebar
                    <MessageBox message="Please check the box for Aggregate by, Scope by, or both" />
                ) : (
                    ""
                )}
            </Stack>
        </div>
    )
}
