import React, { useState } from "react"
import { useMsal } from "@azure/msal-react"
import IconButton from "@material-ui/core/IconButton"
import MenuItem from "@material-ui/core/MenuItem"
import AccountCircle from "@material-ui/icons/AccountCircle"
import Menu from "@material-ui/core/Menu"

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
            <IconButton
                onClick={(event) => {
                    return setAnchorEl(event.currentTarget)
                }}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
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
                        return handleLogout("popup")
                    }}
                    key="logoutPopup"
                >
                    Logout using Popup
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        return handleLogout("redirect")
                    }}
                    key="logoutRedirect"
                >
                    Logout using Redirect
                </MenuItem>
            </Menu>
        </div>
    )
}
