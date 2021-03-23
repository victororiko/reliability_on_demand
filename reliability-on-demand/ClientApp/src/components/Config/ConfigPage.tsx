import * as React from 'react';
import { createTheme, ITheme, PrimaryButton, Separator, Text } from '@fluentui/react';
import  StudySection  from './Study/StudySection';
import { PivotSection } from './PivotSection';
import { MetricSection } from './MetricSection';
import TeamSection from './Team/TeamSection';

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
      <TeamSection />
      
      <StudySection inquiry={{TeamID:3}}/>
      
      {/* <Separator theme={largeTitle}>Pivot</Separator>
      <PivotSection />

      <Separator theme={largeTitle}>Metric</Separator>
      <MetricSection /> */}

      <PrimaryButton>Submit</PrimaryButton>
    </div>
  );
}
