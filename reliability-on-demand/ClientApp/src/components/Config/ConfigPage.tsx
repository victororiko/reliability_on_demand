import * as React from 'react';
// Our components that make up the page
import { StudySection } from '../Study/StudySection';

// Stack
import { containerStackTokens } from '../helpers/Styles';
import { Stack } from '@fluentui/react';
import FailureSection from '../FailureCurve';
import TeamDetails from '../Team/TeamDetails';

export interface IConfigProps {
}

export interface IConfigState {
  currentTeamId: number;
}

export class ConfigPage extends React.Component<IConfigProps, IConfigState> {
  constructor(props: IConfigProps) {
    super(props);
    this.selectTeam = this.selectTeam.bind(this);
    this.state = {
      currentTeamId: -1
    }
  }

  // componentDidMount() {
  //   this.setState({
  //     currentTeamId: -1
  //   })
  // }

  render() {
    return (
      <Stack tokens={containerStackTokens}>
        <TeamDetails callBack={this.selectTeam} startingTeamId={this.state.currentTeamId} />
        <StudySection team_id={this.state.currentTeamId} />
        {/* <FailureSection studyid={3} /> */}
      </Stack>
    );
  }

  extractTeamIDFromState(): number {
    return this.state.currentTeamId;
  }

  selectTeam = (selection: number) => {
    this.setState(
      {
        currentTeamId: selection
      }
    );
  }
}

