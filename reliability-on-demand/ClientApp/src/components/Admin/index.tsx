import React, { useEffect, useState } from "react"

// Msal imports
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react"
import {
    InteractionStatus,
    InteractionType,
    InteractionRequiredAuthError,
    AccountInfo,
} from "@azure/msal-browser"
import Paper from "@material-ui/core/Paper"

// Sample app imports
import { Label } from "reactstrap"
import { MenuPivots } from "./MenuPivots"
import { Loading } from "../helpers/Loading"
import { ErrorComponent } from "../ErrorComponent"
import { callMsGraph } from "../../utils/MsGraphApiCall"
import { loginRequest } from "../../authConfig"
import { UnAuthorizedMessage } from "../helpers/utils"

export interface Props {}

export const AdminPage = (props: Props) => {
    const [graphData, setGraphData] = useState<boolean>()

    const { instance, inProgress } = useMsal()
    // Add here scopes for id token to be used at MS Identity Platform endpoints.
    const [loading, setLoading] = React.useState<boolean>(true)

    useEffect(() => {
        if (!graphData && inProgress === InteractionStatus.None) {
            callMsGraph(instance)
                .then((response) => {
                    setGraphData(response)
                    setLoading(false)
                })
                .catch((e) => {
                    if (e instanceof InteractionRequiredAuthError) {
                        instance.acquireTokenRedirect({
                            ...loginRequest,
                            account: instance.getActiveAccount() as AccountInfo,
                        })
                    }
                })
        }
    }, [inProgress, graphData, instance])

    const renderAdminPivots = (
        <Paper>{graphData ? <MenuPivots /> : <Label>{UnAuthorizedMessage}</Label>}</Paper>
    )

    return (
        <div>
            {loading ? (
                <Loading message="Authentication in progress..." />
            ) : (
                <div>{renderAdminPivots}</div>
            )}
        </div>
    )
}

const onLoad = () => {
    return (
        <div>
            <Loading message="Authentication in progress..." />
        </div>
    )
}

export const Profile = () => {
    const authRequest = {
        ...loginRequest,
    }

    return (
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest}
            errorComponent={ErrorComponent}
            loadingComponent={onLoad}
        >
            <MenuPivots />
        </MsalAuthenticationTemplate>
    )
}
