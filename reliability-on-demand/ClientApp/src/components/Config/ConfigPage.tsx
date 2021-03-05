import * as React from 'react';
import { createTheme, ITheme, Separator, Text } from '@fluentui/react';
import { OwnershipSection } from './OwnershipSection';
import { StudySection } from './StudySection';
import { PivotSection } from './PivotSection';
import { MetricSection } from './MetricSection';

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
      <OwnershipSection />
      
      <Separator theme={my_theme}>Study</Separator>
      <StudySection />
      
      <Separator theme={my_theme}>Pivot</Separator>
      <PivotSection />

      <Separator theme={my_theme}>Metric</Separator>
      <MetricSection />
    </div>
  );
}
