import * as React from 'react';
import { createTheme, ITheme, PrimaryButton, Separator, Text } from '@fluentui/react';
import { StudySection } from './StudySection';
import { PivotSection } from './PivotSection';
import { MetricSection } from './MetricSection';
import OwnershipSection from './OwnershipSection/OwnershipSection';

export interface IConfigProps {
}

export const largeTitle: ITheme = createTheme({
  fonts: {
    medium: {
      fontSize: '30px',
    },
  },
});

export function ConfigPage(props: IConfigProps) {
  return (
    <div>
      <OwnershipSection />
      
      <Separator theme={largeTitle}>Study</Separator>
      <StudySection />
      
      <Separator theme={largeTitle}>Pivot</Separator>
      <PivotSection />

      <Separator theme={largeTitle}>Metric</Separator>
      <MetricSection />

      <PrimaryButton>Submit</PrimaryButton>
    </div>
  );
}
