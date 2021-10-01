import * as React from 'react'
import { ConfigPage } from './Config/ConfigPage';

interface Props {
  
}

export const Home = (props: Props) : React.ReactElement => {
  return (
    <div>
        <h2>Welcome to Reliability on Demand</h2>
        <ConfigPage />
      </div>
  )
}
