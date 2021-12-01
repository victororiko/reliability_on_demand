/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-underscore-dangle */
import * as React from 'react'
import { IColumn, TooltipHost, buildColumns } from '@fluentui/react'
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown'
import { DefaultButton } from '@fluentui/react/lib/Button'
import { Vertical, Pair, Pivot } from './model'
import { FailureSectionDetails } from './FailureSectionDetails'
import { WikiLink } from '../helpers/WikiLink'
import { Loading } from '../helpers/Loading'

export interface FailureSectionProps {
  studyid: number
}

export interface FailureSectionState {
  verticals: Vertical[]
  loading: boolean
  selectedVerticals?: Pair[]
  isButtonClicked: boolean
  pivots: Pivot[]
  isSelectedVerticalSelected: boolean
  hasPivotSelectionChanged: boolean
  selectedPivots?: Pair[]
  selectedSourceSubType: string
}

export class FailureCurve extends React.Component<
  FailureSectionProps,
  FailureSectionState
> {
  // eslint-disable-next-line react/sort-comp
  selectedKeys: Array<Pair> = []

  selectedPivots: Array<Pair> = []

  cols: Array<IColumn> = []

  studyPivotsData: Pivot[] = []

  constructor(props: FailureSectionProps) {
    super(props)

    this.state = {
      verticals: [],
      loading: true,
      selectedVerticals: [],
      isButtonClicked: false,
      pivots: [],
      isSelectedVerticalSelected: false,
      hasPivotSelectionChanged: false,
      selectedPivots: [],
      selectedSourceSubType: '',
    }
  }

  /**
   * Prior to rendering the component, load up study configs from backend
   */
  componentDidMount() {
    this.populateVerticalData()
  }

  // eslint-disable-next-line react/sort-comp
  extractVerticalName(item: Vertical) {
    const p: Pair = {
      key: item.PivotSourceSubType,
      text: item.VerticalName,
    }

    return p
  }

  renderFailureDetailsButton() {
    return (
      <div>
        <TooltipHost content="Press this button if all the required verticals are selected and you would like to configure them one by one">
          <DefaultButton
            text={
              this.state.isButtonClicked
                ? 'Hide Pivot Configuration'
                : 'Change Pivot Configuration'
            }
            onClick={() => {
              return this.setState((prevState) => {
                return { isButtonClicked: !prevState.isButtonClicked }
              })
            }}
            allowDisabledFocus
          />
        </TooltipHost>
      </div>
    )
  }

  renderVerticals() {
    return (
      <div>
        <TooltipHost content="Select all the verticals you would like to configure for your study">
          <Dropdown
            placeholder="Select all the verticals you would like to configure for your study"
            label="Verticals List"
            // eslint-disable-next-line react/jsx-no-bind
            onChange={this.onVerticalSelected}
            multiSelect
            options={this.getVerticalNames()}
          />
        </TooltipHost>
      </div>
    )
  }

  onVerticalSelected? = (
    _event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption,
    _index?: number
  ): void => {
    if (option) {
      const updated = option.selected
        ? [...(this.state.selectedVerticals ?? []), option as Pair]
        : this.state.selectedVerticals?.filter((val) => {
            return val.text !== option.text
          })

      this.setState({
        selectedVerticals: updated,
      })
      this.onVerticalSelectionChangeText(updated)
    }
  }

  onVerticalSelectionChangeText(input: any) {
    if (input) this.selectedKeys = input
  }

  buildColumnArray() {
    this.cols = buildColumns(this.studyPivotsData)
  }

  async populateVerticalData() {
    const response = await fetch('api/Data/GetAllMainVertical')
    const data = await response.json()
    this.setState({ verticals: data, loading: false })
  }

  onConfigureVerticalButtonClicked() {
    return (
      <div>
        <FailureSectionDetails
          studyid={this.props.studyid}
          selectedVerticalsForStudy={[...this.selectedKeys]}
        />
      </div>
    )
  }

  getVerticalNames(): IDropdownOption<Pair>[] {
    const result = this.state.verticals.map(this.extractVerticalName)
    return result
  }

  render(): React.ReactElement {
    const verticals = this.state.loading ? (
      <Loading message="Getting Verticals for you - hang tight" />
    ) : (
      this.renderVerticals()
    )

    const failureDetailButton = this.renderFailureDetailsButton()

    const ConfigureButtonClicked =
      this.state.isButtonClicked === true ? (
        <FailureSectionDetails
          studyid={this.props.studyid}
          selectedVerticalsForStudy={[...this.selectedKeys]}
        />
      ) : (
        ''
      )

    return (
      <div>
        <h1>Failure Curve Section</h1>
        <WikiLink
          title="Wiki for this page"
          url="https://www.osgwiki.com/wiki/RIOD_-_Failure_Curve_Section"
        />
        {verticals}
        {failureDetailButton}
        {ConfigureButtonClicked}
      </div>
    )
  }
}
