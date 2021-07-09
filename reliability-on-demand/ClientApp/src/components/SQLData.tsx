import * as React from "react";
import { SampleConfig } from "../models/config.model";
type MyProps = {
    // message:string;
}
type MyState = {
    all_configs: SampleConfig[],
    loading:boolean;
};

export class SQLData extends React.Component<MyProps,MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      all_configs: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.populateConfigData();
  }

  renderConfigsTable(all_configs: any[]) {
    return (
      <table className="table table-striped" aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Name</th>
            <th>CreationDate</th>
            <th>OwnerContact</th>
            <th>OwnerTeam</th>
            <th>ConfigID</th>
          </tr>
        </thead>
        <tbody>
          {all_configs.map((element) => (
            <tr>
              <td>{element.ConfigName}</td>
              <td>{element.CreationDate}</td>
              <td>{element.OwnerContact}</td>
              <td>{element.OwnerTeam}</td>
              <td>{element.ConfigID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render(): React.ReactElement {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderConfigsTable(this.state.all_configs)
    );

    return (
      <div>
        <h1 id="tabelLabel">Data from SQL</h1>
        <p>List of all Unified Configs stored in our SQL instance</p>
        {contents}
      </div>
    );
  }

  async populateConfigData() {
    const response = await fetch("api/Data/GetAllUnifiedConfigs");
    const data = await response.json();
    this.setState({ all_configs: data, loading: false });
  }
}
