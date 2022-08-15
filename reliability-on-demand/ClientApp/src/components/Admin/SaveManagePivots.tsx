import React from 'react'
import { DefaultButton, TooltipHost, Label } from '@fluentui/react'
import { Pivot } from '../../models/pivot.model'

type Props = {
  callBack: any
  dataSaved: boolean
  pivots: Pivot[]
}

export const SaveManagePivots = (props: Props) => {
  const handleClick = () => {
    props.callBack(props.pivots)
  }

  const saveLabel = !props.dataSaved ? (
    ''
  ) : (
    <div>
      <Label>Data has been saved successfully</Label>
    </div>
  )

  return (
    <div>
      <div>
        <DefaultButton
          text="Save"
          onClick={handleClick}
          allowDisabledFocus
          disabled={false}
          checked={false}
        />
      </div>
      {saveLabel}
    </div>
  )
}
