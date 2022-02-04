/* eslint-disable */
import * as React from 'react'
import { TooltipHost } from '@fluentui/react'
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown'
import { Pair } from './model'
import { FailurePivotsConfigure } from '../FailureCurve/FailurePivotsConfigure'

export interface IFailureSectionDetailsProps {
  studyid: number
  selectedVerticalsForStudy: Pair[]
}

export interface IFailureSectionDetailsState {
  loading: boolean
  isVerticalSelected: boolean
  selectedVertical: Pair
}

export class FailureSectionDetails extends React.Component<
  IFailureSectionDetailsProps,
  IFailureSectionDetailsState
> {
  selectedVerticalsWithPlaceHolder: Pair[] = []
  selectedVerticalsWithPlaceHolderSet: Set<string> | undefined

  constructor(props: any) {
    super(props)

    this.state = {
      loading: true,
      isVerticalSelected: false,
      selectedVertical: { key: 'Select Mode', text: 'Select Mode' },
    }

    this.selectedVerticalsWithPlaceHolderSet = new Set<string>()

    for (let i = 0; i < this.props.selectedVerticalsForStudy.length; i++) {
      if (
        !this.selectedVerticalsWithPlaceHolderSet.has(
          this.props.selectedVerticalsForStudy[i].key.split('_')[0]
        )
      ) {
        let ele = {
          key: this.props.selectedVerticalsForStudy[i].key.split('_')[0],
          text: this.props.selectedVerticalsForStudy[i].key.split('_')[0],
        }
        this.selectedVerticalsWithPlaceHolder.push(ele)
        this.selectedVerticalsWithPlaceHolderSet.add(
          this.props.selectedVerticalsForStudy[i].key.split('_')[0]
        )
      }
    }

    let ele = { key: 'Select Mode', text: 'Select Mode' }
    this.selectedVerticalsWithPlaceHolder.push(ele)
  }

  /**
   * Prior to rendering the component, load up study configs from backend
   */
  componentDidMount() {
    this.populateData()
  }

  populateData() {
    this.setState({ loading: false })
  }

  onVerticalSelected? = (
    event: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption,
    index?: number
  ): void => {
    if (item) {
      if (item.key == 'Select Mode') return
      this.setState({
        isVerticalSelected: true,
        selectedVertical: { key: item.key.toString(), text: item.text },
      })
    }
  }

  renderPivots() {
    return (
      <div>
        <FailurePivotsConfigure
          studyid={this.props.studyid}
          selectedVerticalForStudy={this.state.selectedVertical}
        />
      </div>
    )
  }

  render(): React.ReactElement {
    let verticalSection = (
      <div>
        <TooltipHost content="Select the vertical to configure from the selected list">
          <Dropdown
            label="Select Failure Mode"
            placeholder="Select Mode"
            selectedKey={this.state.selectedVertical.key}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={this.onVerticalSelected}
            options={this.selectedVerticalsWithPlaceHolder}
          />
        </TooltipHost>
      </div>
    )

    let pivotSection =
      this.state.isVerticalSelected == true ? this.renderPivots() : ''

    return (
      <div>
        {verticalSection}
        {pivotSection}
      </div>
    )
  }
}
