import React, { ReactElement } from 'react'

interface Props {
  
}

export const Home = (props: Props) : ReactElement => {
  return (
    <div>
        <h1>Welcome to Reliability on Demand</h1>
        <p>
          To get started click on Fetch data to see a list of releases from
          Kusto.
        </p>
      </div>
  )
}
