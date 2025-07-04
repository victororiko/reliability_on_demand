import * as React from "react"
import { Route, Switch } from "react-router"
// icons doc: https://developer.microsoft.com/en-us/fluentui#/styles/web/icons
import { initializeIcons } from "@fluentui/react/lib/Icons"
import { MsalProvider, MsalAuthenticationTemplate } from "@azure/msal-react"
import { IPublicClientApplication, InteractionType } from "@azure/msal-browser"
import { Layout } from "./components/Layout"
import { Config } from "./components/Config"
import { AdminPage } from "./components/Admin/index"
import "./custom.css"
import { StudySearch } from "./components/StudySearch"
import { Loading } from "./components/helpers/Loading"
import { ErrorComponent } from "./components/ErrorComponent"

import { loginRequest } from "./authConfig"
import { StudyInstance } from "./components/StudyInstance"
import { FailureCurveDisplay } from "./components/FailureCurveDisplay"

type AppProps = {
    pca: IPublicClientApplication
}

initializeIcons()

export const App = ({ pca }: AppProps) => {
    const authRequest = {
        ...loginRequest,
    }

    const onLoad = () => {
        return (
            <div>
                <Loading message="Authentication in progress..." />
            </div>
        )
    }

    return (
        <MsalProvider instance={pca}>
            <MsalAuthenticationTemplate
                interactionType={InteractionType.Redirect}
                authenticationRequest={authRequest}
                errorComponent={ErrorComponent}
                loadingComponent={onLoad}
            >
                <Layout>
                    <Switch>
                        {/* Place more specific routes on top, and more relaxed 
          routes like / in the bottom. Switch will take the first 
          matching route and render appropriate component. It will 
        ignore rest of the routes once it has found matching route */}
                        <Route path="/admin-page">
                            <AdminPage />
                        </Route>
                        <Route path="/study-search" component={StudySearch} />
                        <Route path="/study-instance" component={StudyInstance} />
                        <Route path="/failure-curve/:id" component={FailureCurveDisplay} />
                        {/* If none of the previous routes render anything,
            this route acts as a fallback.
            
            Important: A route with path="/" will *always* match
            the URL because all URLs begin with a /. So that's
        why we put this one last of all */}
                        <Route exact path="/" component={Config} />
                    </Switch>
                </Layout>
            </MsalAuthenticationTemplate>
        </MsalProvider>
    )
}
