import { PrimaryButton } from '@fluentui/react'
import React from 'react'

type Props = {
  studyid: number
}

const SavePivotConfigButton = (props: Props) => {
  const handleClick = () => {
    console.log(`Saved pivot config with study id = ${props.studyid}`)
  }
  return (
    <div>
      <PrimaryButton text="Add Pivot Config" onClick={handleClick} />
    </div>
  )
}

export default SavePivotConfigButton
