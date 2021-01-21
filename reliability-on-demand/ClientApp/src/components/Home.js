import React, { Component } from "react";

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div>
        <h1>Welcome to Reliability on Demand</h1>
        <p>
          To get started click on Fetch data to see a list of releases from
          Kusto.
        </p>
        <p>To see the same data in JSON - </p>
        <a href="https://localhost:44335/api/Data/GetAllReleases">
          https://localhost:44335/api/Data/GetAllReleases
        </a>
      </div>
    );
  }
}
