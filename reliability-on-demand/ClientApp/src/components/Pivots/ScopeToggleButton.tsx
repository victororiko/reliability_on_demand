import { DefaultButton } from "@fluentui/react"
import React, { useState } from "react"

interface IScopeToggleButtonProps {}

export const ScopeToggleButton = (props: IScopeToggleButtonProps) => {
    // state
    const [showPivotScope, setShowPivotScope] = useState<boolean>(false)

    // handlers
    const togglePivotScope = () => {
        setShowPivotScope(!showPivotScope)
    }

    // render()
    return (
        <div>
            <DefaultButton
                text={showPivotScope ? "Hide Scopes" : "Show Scopes"}
                onClick={togglePivotScope}
            />
        </div>
    )
}
