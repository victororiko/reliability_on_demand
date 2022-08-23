import React, { useState } from "react"
import { useMsal } from "@azure/msal-react"
import Button from "@material-ui/core/Button"
import MenuItem from "@material-ui/core/MenuItem"
import Menu from "@material-ui/core/Menu"
import { PopupRequest } from "@azure/msal-browser"
import { loginRequest } from "../authConfig"

export const SignInButton = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

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
            >
                Login
            </Button>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={open}
                onClose={() => {
                    return setAnchorEl(null)
                }}
            >
                <MenuItem
                    onClick={() => {
                        return handleLogin("popup")
                    }}
                    key="loginPopup"
                >
                    Sign in using Popup
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        return handleLogin("redirect")
                    }}
                    key="loginRedirect"
                >
                    Sign in using Redirect
                </MenuItem>
            </Menu>
        </div>
    )
}
