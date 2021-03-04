import * as React from 'react';
import { createTheme, ITheme, Separator, Text } from '@fluentui/react';
import { Ownership } from './Ownership';
import { StudySection } from './StudySection';

export interface IConfigProps {
}

const my_theme: ITheme = createTheme({
  fonts: {
    medium: {
      fontSize: '30px',
    },
  },
});

export function ConfigPage(props: IConfigProps) {
  return (
    <div>
      <Text>Config Page</Text>
      <Separator theme={my_theme}>Ownership</Separator>
      <Ownership />
      <Separator theme={my_theme}>Study</Separator>
      <StudySection />
      <Separator theme={my_theme}>Pivot</Separator>
      <Separator theme={my_theme}>Metric</Separator>
    </div>
  );
}
