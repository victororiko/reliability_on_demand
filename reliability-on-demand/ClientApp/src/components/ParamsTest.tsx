import * as React from 'react';
import * as QueryString from "query-string"


export function ParamsTest (props: any) {
  const params = QueryString.parse(props.location.search);
  return (
    <div>
      <h1>Query String Parameters Test Page</h1>
      <h3>All params passed in</h3>
      <pre><code>{JSON.stringify(params,null, ' ')}</code></pre>
    </div>
  );
}
