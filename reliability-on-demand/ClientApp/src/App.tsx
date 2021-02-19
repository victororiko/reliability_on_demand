import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { KustoData } from "./components/KustoData";
import { SQLData } from "./components/SQLData";
import { About } from "./components/About";

import "./custom.css";
import registerServiceWorker from "./registerServiceWorker";
import { useLocation } from "react-router-dom";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const App = () => {
  let query = useQuery();

  
    return (
      <Layout>
        <Switch>
          {/* This is how you route to a component passing in properties */}
          <Route path="/about">
            <About name={query.get("name")} />
          </Route>
          {/* Place more specific routes on top, and more relaxed 
          routes like / in the bottom. Swith will take the first 
          matching route and render appropriate component. It will 
          ignore rest of the routes once it has found matching route */}
          <Route path="/kusto-data" component={KustoData} />

          <Route path="/sql-data" component={SQLData} />

          {/* If none of the previous routes render anything,
            this route acts as a fallback.

            Important: A route with path="/" will *always* match
            the URL because all URLs begin with a /. So that's
            why we put this one last of all */}
          <Route exact path="/" component={Home} />
        </Switch>
      </Layout>
    );
  
}

registerServiceWorker();
