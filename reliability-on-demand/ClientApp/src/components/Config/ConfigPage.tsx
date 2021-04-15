import * as React from 'react';
// Our components that make up the page
import StudySection from '../Study/StudySection';
import TeamSection from '../Team/TeamSection';

// Stack
import { containerStackTokens } from '../helpers/Styles';
import { Stack } from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react';
import { ConfigInquiry, TeamConfig } from '../../models/config.model';

export interface IConfigProps {
  //TODO pass in the current user
}

export interface IConfigState {
  currentTeam?: TeamConfig;
}

export class ConfigPage extends React.Component<IConfigProps, IConfigState> {
  constructor(props: IConfigProps) {
      super(props);
      this.printTeam = this.printTeam.bind(this);
  }

  componentDidMount() {
    this.setState({
      currentTeam: undefined
    })
  }

  render() {
    return (
      <Stack tokens={containerStackTokens}>
        <TeamSection printHello={this.printTeam} />
        <StudySection inquiry={{ TeamID: this.extractTeamIDFromState()}} />
        <PrimaryButton>Submit</PrimaryButton>
      </Stack>
    );
  }

  extractTeamIDFromState():number{
    return 3;
  }

  printTeam = (selectedTeam: TeamConfig) => {
    console.log(selectedTeam);
    this.setState(
      {
        currentTeam: selectedTeam
      }
    );
  }
}

