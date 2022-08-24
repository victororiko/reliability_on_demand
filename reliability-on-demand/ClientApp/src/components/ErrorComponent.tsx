import { MsalAuthenticationResult } from "@azure/msal-react"
import React from "react"
import { MessageBox } from "./helpers/MessageBox"

export const ErrorComponent: React.FC<MsalAuthenticationResult> = ({ error }) => {
    const err = error ? error.errorCode : "unknown error"
    const msg = `An Error Occurred:${{ err }}`

    return <MessageBox message={msg} />
}
