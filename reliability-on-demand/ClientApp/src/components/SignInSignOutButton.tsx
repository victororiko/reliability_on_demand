import { useIsAuthenticated, useMsal } from "@azure/msal-react"
import { InteractionStatus } from "@azure/msal-browser"
import React from "react"
import { SignInButton } from "./SignInButton"
import { SignOutButton } from "./SignOutButton"

const SignInSignOutButton = () => {
    const { inProgress } = useMsal()
    const isAuthenticated = useIsAuthenticated()

    if (isAuthenticated) {
        return <SignOutButton />
    }
    if (
        inProgress !== InteractionStatus.Startup &&
        inProgress !== InteractionStatus.HandleRedirect
    ) {
        // inProgress check prevents sign-in button from being displayed briefly after returning from a redirect sign-in. Processing the server response takes a render cycle or two
        return <SignInButton />
    }
    return null
}

export default SignInSignOutButton
