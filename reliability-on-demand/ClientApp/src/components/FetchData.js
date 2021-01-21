import React, { Component } from "react";

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { all_releases: [], loading: true };
  }

  componentDidMount() {
    this.populateReleaseData();
  }

  static renderReleasesTable(all_releases) {
    return (
      <table className="table table-striped" aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Release</th>
          </tr>
        </thead>
        <tbody>
          {all_releases.map((element) => (
            <tr>
              <td>{element.Release}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      FetchData.renderReleasesTable(this.state.all_releases)
    );

    return (
      <div>
        <h1 id="tabelLabel">Data from Kusto</h1>
        <p>List of all Releases stored in our Kusto instance.</p>
        {contents}
      </div>
    );
  }

  async populateReleaseData() {
    const response = await fetch("api/Data/GetAllReleases");
    const data = await response.json();
    this.setState({ all_releases: data, loading: false });
  }
}
