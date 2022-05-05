import React from 'react'
import { DefaultButton, PrimaryButton, TooltipHost } from '@fluentui/react'

interface Props {
  ButtonName: string
  ButtonClicked: boolean
  // callBack: any
}

// TO DO - IMPLEMENTATION Not DONE Completely
export const AddStudyButton = (props: Props) => {
  const [ButtonClicked, setButtonClicked] = React.useState<boolean>(false)

  // onMount
  React.useEffect(() => {
    setButtonClicked(props.ButtonClicked)
  }, [])

  return (
    <TooltipHost content="Press this button if all the required verticals are selected and you would like to configure them one by one">
      <DefaultButton
        text={props.ButtonName}
        onClick={() => {
          return {
            ButtonClicked: !ButtonClicked,
          }
        }}
        allowDisabledFocus
      />
    </TooltipHost>
  )
}
