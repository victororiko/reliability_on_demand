import * as React from 'react';
// Our components that make up the page
import StudySection from '../Study/StudySection';
import TeamSection from '../Team/TeamSection';

// Stack
import { containerStackTokens } from '../helpers/Styles';
import { Stack } from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react';

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




