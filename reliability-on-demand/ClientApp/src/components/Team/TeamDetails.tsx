import { TextField } from '@fluentui/react'
import axios from 'axios'
import * as React from 'react'
import { TeamConfig } from '../../models/team.model'
import { Loading } from '../helpers/Loading'
import OwnerContactAlias from './OwnerContactAlias'
import OwnerTeamFriendlyName from './OwnerTeamFriendlyName'
import OwnerTraigeAlias from './OwnerTriageAlias'
import { TeamComboBox } from './TeamComboBox'

export interface ITeamDetailsProps {
  callBack: any
}

interface ITeamDetailsState {
  teamConfigs: TeamConfig[]
  loading: boolean
  currentTeam?: TeamConfig
  newTeam: TeamConfig
}

export default class TeamDetails extends React.Component<
  ITeamDetailsProps,
  ITeamDetailsState
> {
  constructor(props: any) {
    super(props)
    // set initial state which will be used by render()
    this.state = {
      teamConfigs: [],
      loading: true,
      currentTeam: undefined,
      newTeam: {
        teamID: -2, // this value is dropped in backend. SQL table auto-generates the TeamID. Using -2 to avoid with the -1 used in TeamCombobox
        ownerContact: '',
        ownerTeamFriendlyName: '',
        ownerTriageAlias: '',
      },
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  /**
   * Prior to rendering the component, load up team configs from backend
   */
  componentDidMount() {
    axios.get('api/Data/GetAllTeamConfigs').then((res) => {
      this.setState({
        teamConfigs: res.data as TeamConfig[],
        loading: false,
      })
    })
  }

  // functionality methods

  handleSubmit(event: any) {
    // takes the current inputed values from user and makes a call to DB with the TeamConfig
    console.debug(
      `You just added a new team! The values you entered = ${JSON.stringify(
        this.state.newTeam
      )}`
    )
    event.preventDefault()
    axios.post('api/Data/AddTeam', this.state.newTeam).then((res) => {
      console.debug(res)
    })
  }

  getOwnerStringFromUser = (value: string) => {
    this.state.newTeam.ownerContact = value
  }

  getOwnerTeamFrienclyNameFromUser = (value: string) => {
    this.state.newTeam.ownerTeamFriendlyName = value
  }

  getOwnerTriageAliasUser = (value: string) => {
    this.state.newTeam.ownerTriageAlias = value
  }

  private getTeamFromNumber(selection: number): TeamConfig | undefined {
    const parsedStudy = this.state.teamConfigs.find((element) => {
      return element.teamID === selection
    })
    return parsedStudy
  }

  selectCurrentTeam = (team_id_selection: number) => {
    this.setState({
      currentTeam: this.getTeamFromNumber(team_id_selection),
    })
    this.props.callBack(team_id_selection)
  }

  // required render method
  renderContent() {
    return (
      <div>
        <h1>Team Section</h1>
        <TeamComboBox
          data={this.state.teamConfigs}
          callBack={this.selectCurrentTeam}
        />

        <OwnerContactAlias
          currentTeam={this.state.currentTeam}
          callback_function={this.getOwnerStringFromUser}
        />
        <OwnerTeamFriendlyName
          currentTeam={this.state.currentTeam}
          callback_function={this.getOwnerTeamFrienclyNameFromUser}
        />
        <OwnerTraigeAlias
          currentTeam={this.state.currentTeam}
          callback_function={this.getOwnerTriageAliasUser}
        />

        {/* optional section */}
        <TextField
          label="Compute Resource Location"
          placeholder="e.g. Data Bricks or Cosmos location"
          aria-label="Compute Resource Location"
          disabled={this.state.currentTeam !== undefined}
        />
      </div>
    )
  }

  render(): React.ReactElement {
    const contents = this.state.loading ? (
      <Loading message="Getting Teams for you - hang tight" />
    ) : (
      this.renderContent()
    )
    return <div>{contents}</div>
  }
}
