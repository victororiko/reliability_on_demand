/* eslint-disable */
import { DefaultButton, Label, TooltipHost } from '@fluentui/react'
import * as React from 'react'
import { FailureConfig } from './model'
import axios from 'axios'
// Our components that make up the page

export interface IFailureCurveSaveProps {
  failureConfigToSave: FailureConfig
}

export interface IFailureCurveSaveState {
  hasSavedFailureCurve: boolean
}

export class FailureCurveSave extends React.Component<
  IFailureCurveSaveProps,
  IFailureCurveSaveState
> {
  constructor(props: IFailureCurveSaveProps) {
    super(props)

    this.state = {
      hasSavedFailureCurve: false,
    }
    this._saveClicked = this._saveClicked.bind(this)
  }

  componentDidMount() {
    this._saveClicked = this._saveClicked.bind(this)
    this.state = {
      hasSavedFailureCurve: false,
    }
  }

  async _saveClicked() {
    axios
      .post('api/Data/SavedFailureConfig', this.props.failureConfigToSave)
      .then((response) => {
        console.log(response.data)
        this.setState({ hasSavedFailureCurve: true })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  render() {
    let saveButton = (
      <TooltipHost content="Click to save all the selected configuration">
        <div>
          <DefaultButton
            text="Save Config"
            onClick={this._saveClicked}
            allowDisabledFocus
            disabled={false}
            checked={false}
          />
        </div>
      </TooltipHost>
    )

    let saveStatement =
      this.state.hasSavedFailureCurve == true ? (
        <div>
          <Label>Data has been saved successfully</Label>
        </div>
      ) : (
        ''
      )

    return (
      <div>
        {saveButton}
        {saveStatement}
      </div>
    )
  }
}
