import * as React from "react"
import { Route, Switch } from "react-router"
// icons doc: https://developer.microsoft.com/en-us/fluentui#/controls/web/icon
import { initializeIcons } from "@fluentui/react/lib/Icons"
import { Layout } from "./components/Layout"
import { Config } from "./components/Config"
import { KustoData } from "./components/Other/KustoData"
import { AdminPage } from "./components/Admin/index"
import "./custom.css"

initializeIcons()

export const App = () => {
    return (
        <Layout>
            <Switch>
                {/* Place more specific routes on top, and more relaxed 
          routes like / in the bottom. Switch will take the first 
          matching route and render appropriate component. It will 
        ignore rest of the routes once it has found matching route */}
                <Route path="/kusto-data" component={KustoData} />
                <Route path="/admin-page" component={AdminPage} />
                {/* If none of the previous routes render anything,
            this route acts as a fallback.

            Important: A route with path="/" will *always* match
            the URL because all URLs begin with a /. So that's
            why we put this one last of all */}
                <Route exact path="/" component={Config} />
            </Switch>
        </Layout>
    )
}
