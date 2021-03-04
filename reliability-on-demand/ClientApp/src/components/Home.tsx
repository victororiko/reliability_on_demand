import * as React from 'react'
import { Config } from './Config';

interface Props {
  
}

export const Home = (props: Props) : React.ReactElement => {
  console.log(props);
  return (
    <div>
        <h1>Welcome to Reliability on Demand</h1>
        <p>
          To get started click on any of the tabs on the top right to explore current functionality.
        </p>
        <Config />
      </div>
  )
}
