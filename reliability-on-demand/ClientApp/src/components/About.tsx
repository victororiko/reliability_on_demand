import * as React from 'react';

export interface IAboutProps {
    name:string | null;
}

export function About (props: IAboutProps) {
  return (
    <div>
      About page
      name = {props.name}
    </div>
  );
}
