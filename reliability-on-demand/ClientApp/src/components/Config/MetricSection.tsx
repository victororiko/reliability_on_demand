import { IDropdownOption, Dropdown, TextField, SpinButton } from '@fluentui/react'
import * as React from 'react'

export interface IMetricSectionProps {}

export function MetricSection(props: IMetricSectionProps) {
  return (
    <div>
      <TextField
        label="Metric Name"
        required
        placeholder="e.g. PCT_MACHS_BAD_EARLY"
        aria-label="Metric Name"
      />

      {/* User selects from List [Usage, Non-Usage] */}
      <Dropdown
        label="Metric Type"
        placeholder="Select a Metric Type"
        options={getMetricType()}
        required
        aria-label="Select a Metric Type"
      />

      <SpinButton
        defaultValue="1"
        iconProps={{ iconName: 'IncreaseIndentLegacy' }}
        label="Min Usage (in minutes)"
        min={0}
        max={100}
        step={1}
        incrementButtonAriaLabel="Increase value by 1"
        decrementButtonAriaLabel="Decrease value by 1"
      />

      <SpinButton
        defaultValue="60"
        iconProps={{ iconName: 'IncreaseIndentLegacy' }}
        label="Max Usage (in minutes)"
        min={0}
        max={100}
        step={1}
        incrementButtonAriaLabel="Increase value by 1"
        decrementButtonAriaLabel="Decrease value by 1"
      />

      <SpinButton
        defaultValue="0"
        label="Failure Rate (decmial)"
        min={0}
        max={10}
        step={0.1}
        incrementButtonAriaLabel="Increase value by 0.1"
        decrementButtonAriaLabel="Decrease value by 0.1"
      />
    </div>
  )
}

function getMetricType(): IDropdownOption<any>[] {
  return [
    { key: 'Usage', text: 'Usage' },
    { key: 'Non-Usage', text: 'Non-Usage' },
  ]
}
