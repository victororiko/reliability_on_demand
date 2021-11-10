/* eslint-disable react/no-unused-state */
import { Dropdown, IDropdownOption, Separator } from '@fluentui/react'
import * as React from 'react'
import { FormEvent } from 'react'

export interface IMyDropdownProps {
  data: any
  useKey: string
  showValueFor: string
  enabled: boolean
  handleOptionChange: any
  label: string
  placeholder: string
  required: boolean
}

export interface IMyDropdownState {
  parsedOptions: IDropdownOption[]
  currentOption: IDropdownOption
}

export class MyDropdown extends React.Component<IMyDropdownProps, IMyDropdownState> {
  constructor(props: IMyDropdownProps) {
    super(props)
    this.state = {
      parsedOptions: [],
      currentOption: { key: '', text: '' },
    }
  }

  componentDidMount() {
    this.parseInputToState()
  }

  onOptionChange = (event: FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    this.props.handleOptionChange(option)
  }

  getTeamConfig(id: string | number | undefined) {
    const ans = this.state.parsedOptions.find((x) => x.key === id)
    return ans || { key: '', text: '' }
  }

  extractDropdownOption = (item: any) => ({
      key: item[this.props.useKey],
      text: item[this.props.showValueFor],
    })

  parseInputToState() {
    const newArr: IDropdownOption[] = this.props.data.map(this.extractDropdownOption)
    newArr.push({
      key: '-1',
      text: 'Add...',
    })
    // set state based on data you get
    this.setState({
      parsedOptions: newArr,
    })
  }

  public render() {
    return (
      <div>
        <Separator>My Custom Dropdown Component</Separator>
        <Dropdown
          label={this.props.label}
          placeholder={this.props.placeholder}
          required={this.props.required}
          options={this.state.parsedOptions}
          disabled={!this.props.enabled}
          onChange={this.onOptionChange}
          aria-label={this.props.label}
        />
      </div>
    )
  }
}
