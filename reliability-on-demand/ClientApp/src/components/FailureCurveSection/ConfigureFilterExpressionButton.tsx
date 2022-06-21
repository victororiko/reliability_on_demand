import React from 'react'
import { DefaultButton, TooltipHost } from '@fluentui/react'

type Props = {
  callBack: any
}

export const ConfigureFilterExpressionButton = (props: Props) => {
  const handleClick = () => {
    props.callBack()
  }

  return (
    <TooltipHost content="Press this button if all the required verticals are selected and you would like to configure them one by one">
      <DefaultButton
        text="Configure Filter Expression"
        onClick={handleClick}
        allowDisabledFocus
      />
    </TooltipHost>
  )
}
