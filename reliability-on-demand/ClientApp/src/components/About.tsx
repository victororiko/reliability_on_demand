import * as React from 'react';

export interface IAboutProps {
    // name:string | null;
}

export function About (props: any) {
  return (
    <div>
      About page
      All props = {JSON.stringify(props)}
    </div>
  );
}
