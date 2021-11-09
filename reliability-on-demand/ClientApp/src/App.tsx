import * as React from 'react'
import { Route, Switch } from 'react-router'
import { Layout } from './components/Layout'
import { ConfigPage } from './components/Config/ConfigPage'
import { KustoData } from './components/Other/KustoData'
import { ParamsTest } from './components/Other/ParamsTest'
import './custom.css'
// icons doc: https://developer.microsoft.com/en-us/fluentui#/controls/web/icon
import { initializeIcons } from '@fluentui/react/lib/Icons'
initializeIcons()

export const App = () => {
  return (
    <Layout>
      <Switch>
        {/* Place more specific routes on top, and more relaxed 
          routes like / in the bottom. Switch will take the first 
          matching route and render appropriate component. It will 
        ignore rest of the routes once it has found matching route */}
        <Route path="/params-test" component={ParamsTest} />
        <Route path="/kusto-data" component={KustoData} />
        {/* If none of the previous routes render anything,
            this route acts as a fallback.

            Important: A route with path="/" will *always* match
            the URL because all URLs begin with a /. So that's
            why we put this one last of all */}
        <Route exact path="/" component={ConfigPage} />
      </Switch>
    </Layout>
  )
}
