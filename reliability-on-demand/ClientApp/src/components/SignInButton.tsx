import React, { useState } from "react"
import { useMsal } from "@azure/msal-react"
import { Button } from "@fluentui/react"
import { loginRequest } from "../authConfig"

export const SignInButton = () => {
    const [anchorEl, setAnchorEl] = useState<null | any>(null)

    const { instance } = useMsal()
    const open = Boolean(anchorEl)

    const handleLogin = (loginType: string) => {
        setAnchorEl(null)

        if (loginType === "popup") {
            instance.loginPopup(loginRequest)
        } else if (loginType === "redirect") {
            instance.loginRedirect(loginRequest)
        }
    }

    return (
        <div>
            <Button
                onClick={(event) => {
                    return setAnchorEl(event.currentTarget)
                }}
                color="inherit"
                name="Login"
            />
            <Button
                onClick={() => {
                    return handleLogin("popup")
                }}
                key="loginPopup"
                name="Sign in using Popup"
            />
            <Button
                onClick={() => {
                    return handleLogin("redirect")
                }}
                key="loginRedirect"
                name="Sign in using Redirect"
            />
        </div>
    )
}
