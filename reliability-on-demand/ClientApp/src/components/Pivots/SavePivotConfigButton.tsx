import { PrimaryButton } from '@fluentui/react'
import React from 'react'

type Props = {
  studyid: number
  selectedPivots: any
}

export const SavePivotConfigButton = (props: Props) => {
  const handleClick = () => {
    console.log(`Saved pivot config with study id = ${props.studyid}`)
    console.log(props.selectedPivots)
  }
  return (
    <div>
      <PrimaryButton text="Add Pivot Config" onClick={handleClick} />
    </div>
  )
}