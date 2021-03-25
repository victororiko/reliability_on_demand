import * as React from 'react';
import { createTheme, ITheme, PrimaryButton} from '@fluentui/react';
import  StudySection  from './Study/StudySection';
import TeamSection from './Team/TeamSection';

export interface IConfigProps {
  //TODO pass in the current user
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

      <PrimaryButton>Submit</PrimaryButton>
    </div>
  );
}
