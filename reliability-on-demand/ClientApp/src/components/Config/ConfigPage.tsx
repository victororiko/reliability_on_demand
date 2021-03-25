import * as React from 'react';
import { createTheme, DefaultPalette, IStackItemStyles, IStackStyles, IStackTokens, ITheme, PrimaryButton, Stack } from '@fluentui/react';
import StudySection from './Study/StudySection';
import TeamSection from './Team/TeamSection';

export interface IConfigProps {
  //TODO pass in the current user
}

export function ConfigPage() {
  return (
    <Stack tokens={containerStackTokens}>
      <TeamSection />
      <StudySection inquiry={{ TeamID: 3 }} />
      <PrimaryButton>Submit</PrimaryButton>
    </Stack>
  );
}


// Separator related styles
export const largeTitle: ITheme = createTheme({
  fonts: {
    medium: {
      fontSize: '30px',
    },
  },
});
// Stack related stuff
const containerStackTokens: IStackTokens = { childrenGap: 10 };

