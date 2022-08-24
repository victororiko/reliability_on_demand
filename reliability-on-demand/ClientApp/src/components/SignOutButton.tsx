import React, { useState } from "react"
import { useMsal } from "@azure/msal-react"
import { Button } from "reactstrap"

export const SignOutButton = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const { instance } = useMsal()
    const open = Boolean(anchorEl)

    const handleLogout = (logoutType: string) => {
        setAnchorEl(null)

        if (logoutType === "popup") {
            instance.logoutPopup({
                mainWindowRedirectUri: "/",
            })
        } else if (logoutType === "redirect") {
            instance.logoutRedirect()
        }
    }

    return (
        <div>
            <Button
                onClick={(event) => {
                    return setAnchorEl(event.currentTarget)
                }}
                color="inherit"
            />
            <Button
                onClick={() => {
                    return handleLogout("popup")
                }}
                key="logoutPopup"
                name="Logout using Popup"
            />
            <Button
                onClick={() => {
                    return handleLogout("redirect")
                }}
                key="logoutRedirect"
                name="Logout using Redirect"
            />
        </div>
    )
}
