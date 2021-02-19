import * as React from 'react';
import * as QueryString from "query-string"


export interface IAboutProps {
    // name:string | null;
}

export function About (props: any) {
  const params = QueryString.parse(props.location.search);
  return (
    <div>
      <h1>About</h1>
      <h3>All params passed in = {JSON.stringify(params)}</h3>
    </div>
  );
}
