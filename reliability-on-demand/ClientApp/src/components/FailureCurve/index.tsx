/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-underscore-dangle */
import * as React from 'react'
import { IColumn, TooltipHost, buildColumns } from '@fluentui/react'
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown'
import { DefaultButton } from '@fluentui/react/lib/Button'
import axios from 'axios'
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
  hasPivotSelectionChanged: boolean
  selectedPivots?: Pair[]
  selectedSourceSubType: string
  prevStudyID: number
  byDefaultVerticals: Vertical[]
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

  byDefaultSelection: string[] = []

  verticalDefaultKeys: string[] = []

  selectedKeysOnly: string[] = []

  hasVerticalOnChangeCalled: boolean = false

  selectedVerticals: Pair[] = []

  byDefaultVerticals: Vertical[] = []

  constructor(props: FailureSectionProps) {
    super(props)

    this.state = {
      verticals: [],
      loading: true,
      selectedVerticals: [],
      isButtonClicked: false,
      pivots: [],
      hasPivotSelectionChanged: false,
      selectedPivots: [],
      selectedSourceSubType: '',
      prevStudyID: -2,
      byDefaultVerticals: [],
    }
  }

  /**
   * Prior to rendering the component, load up study configs from backend
   */
  componentDidMount() {
    this.populateVerticalData()
  }

  componentDidUpdate() {
    this.loadConfiguredVerticals()
  }

  // eslint-disable-next-line react/sort-comp
  extractVerticalName(item: Vertical) {
    const p: Pair = {
      key: item.PivotSourceSubType.concat('_', item.VerticalName),
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
                return {
                  isButtonClicked: !prevState.isButtonClicked,
                }
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
            selectedKeys={this.getDefaultVerticalKeys()}
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
        ? [...(this.selectedVerticals ?? []), option as Pair]
        : this.selectedVerticals?.filter((val) => {
            return val.text !== option.text
          })

      this.selectedVerticals = updated

      this.onVerticalSelectionChangeText(updated)
      this.setState({ prevStudyID: this.props.studyid })
    }
  }

  onVerticalSelectionChangeText(input: any) {
    this.selectedKeysOnly = []

    if (input) {
      this.selectedKeys = input

      for (let i = 0; i < this.selectedKeys.length; i++)
        this.selectedKeysOnly.push(this.selectedKeys[i].key)
    }
  }

  buildColumnArray() {
    this.cols = buildColumns(this.studyPivotsData)
  }

  async populateVerticalData() {
    const response = await fetch('api/Data/GetAllMainVertical')
    const data = await response.json()
    this.setState({ verticals: data, loading: false })
  }

  isSame(verticals1: Array<Vertical>, verticals2: Array<Vertical>) {
    if (verticals1.length != verticals2.length) {
      return false
    }

    for (let i = 0; i < verticals1.length; i++) {
      let flag = false
      for (let j = 0; j < verticals2.length; j++) {
        if (verticals2[j].VerticalName === verticals1[i].VerticalName) {
          flag = true
          break
        }
      }

      if (flag === false) return false
    }

    return true
  }

  async loadConfiguredVerticals() {
    if (this.props.studyid > 0) {
      await axios
        .get(`api/Data/GetConfiguredVerticalForAStudy/${this.props.studyid}`)
        .then((res) => {
          console.debug(res.data)
          this.byDefaultVerticals = res.data
          if (
            !this.isSame(this.byDefaultVerticals, this.state.byDefaultVerticals)
          )
            this.setState({ byDefaultVerticals: res.data })
        })
        .catch((err) => {
          console.error('Axios Error:', err.message)
        })
    }
  }

  getVerticalNames(): IDropdownOption<Pair>[] {
    const result = this.state.verticals.map(this.extractVerticalName)
    return result
  }

  getDefaultVerticalKeys() {
    this.verticalDefaultKeys = []

    const tempSelectedPair: Pair[] = []

    if (this.props.studyid > 0) {
      for (let i = 0; i < this.state.byDefaultVerticals.length; i++) {
        const k = this.state.byDefaultVerticals[i].PivotSourceSubType.concat(
          '_',
          this.state.byDefaultVerticals[i].VerticalName
        )
        const ele: Pair = {
          key: k,
          text: this.state.byDefaultVerticals[i].VerticalName,
        }
        this.verticalDefaultKeys.push(k)
        tempSelectedPair.push(ele)
      }

      this.selectedKeys =
        this.state.byDefaultVerticals !== undefined &&
        this.state.byDefaultVerticals.length > 0
          ? this.state.byDefaultVerticals.map(this.extractVerticalName)
          : this.selectedKeys
    }

    if (this.state.prevStudyID != this.props.studyid) {
      this.selectedVerticals = tempSelectedPair
      return this.verticalDefaultKeys
    }
    return this.selectedKeysOnly
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
          selectedVerticalsForStudy={this.selectedVerticals}
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
