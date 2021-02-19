import * as React from 'react';

export interface IAboutProps {
    name:string;
}

export function About (props: IAboutProps) {
  return (
    <div>
      About page
      name = {props.name}
    </div>
  );
}
