import * as React from 'react'
// Our components that make up the page
import { Stack } from '@fluentui/react'
import { StudySection } from '../Study/StudySection'
import TeamDetails from '../Team/TeamDetails'
import { FailureCurve } from '../FailureCurve'

// Stack
import { containerStackTokens } from '../helpers/Styles'

export interface IConfigProps {}

export interface IConfigState {
  currentTeamId: number
  currentStudyId: number
}

export class ConfigPage extends React.Component<IConfigProps, IConfigState> {
  constructor(props: IConfigProps) {
    super(props)
    this.selectTeam = this.selectTeam.bind(this)
    // -1 denotes create new Item (like create new Team, create new Study etc...)
    this.state = {
      currentTeamId: -1,
      currentStudyId: -1,
    }
  }

  
  selectTeam = (selection: number) => {
    this.setState({
      currentTeamId: selection,
    })
    }


  selectStudy = (item: number) => {
    this.setState({
      currentStudyId: item,
    })
    }

    // functionality methods
  extractTeamIDFromState(): number {
    return this.state.currentTeamId
  }

  render() {
    return (
      <Stack tokens={containerStackTokens}>
        <TeamDetails callBack={this.selectTeam} startingTeamId={this.state.currentTeamId} />
        <StudySection team_id={this.state.currentTeamId} callBack={this.selectStudy} />
        <FailureCurve studyid={this.state.currentStudyId} />
      </Stack>
    )
  }
}
