import * as React from 'react';
import { createTheme, ITheme, Separator, Text } from '@fluentui/react';

export interface IConfigProps {
}

const my_theme: ITheme = createTheme({
    fonts: {
      medium: {
        fontSize: '30px',
      },
    },
  });
  
export function Config (props: IConfigProps) {
  return (
    <div>
      <h1>Config Page</h1>
      <Separator theme={my_theme}>Ownership</Separator>
    
      <Separator theme={my_theme}>Study</Separator>
      <Separator theme={my_theme}>Pivot</Separator>
      <Separator theme={my_theme}>Metric</Separator>
    </div>
  );
}
