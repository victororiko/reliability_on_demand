import React, { ReactElement } from 'react'

interface Props {
  
}

export const Home = (props: Props) : ReactElement => {
  console.log(props);
  return (
    <div>
        <h1>Welcome to Reliability on Demand</h1>
        <p>
          To get started click on any of the tabs on the top right to explore current functionality.
        </p>
      </div>
  )
}
