import * as React from "react"
import { Loading } from "../helpers/Loading"

type MyProps = {
    // message:string;
}
type MyState = {
    all_releases: any[]
    loading: boolean
}

export class KustoData extends React.Component<MyProps, MyState> {
    constructor(props: any) {
        super(props)
        this.state = { all_releases: [], loading: true }
    }

    componentDidMount() {
        this.populateReleaseData()
    }

    static renderReleasesTable(all_releases: any[]) {
        return (
            <table className="table table-striped" aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Release</th>
                    </tr>
                </thead>
                <tbody>
                    {all_releases.map((element) => {
                        return (
                            <tr>
                                <td>{element.Release}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    async populateReleaseData() {
        const response = await fetch("api/Data/GetAllReleases")
        const data = await response.json()
        this.setState({ all_releases: data, loading: false })
    }

    render() {
        const contents = this.state.loading ? (
            <Loading message="Loading data from Kusto :)" />
        ) : (
            KustoData.renderReleasesTable(this.state.all_releases)
        )

        return (
            <div>
                <h1 id="tabelLabel">Data from Kusto</h1>
                <p>List of all Releases stored in our Kusto instance.</p>
                {contents}
            </div>
        )
    }
}
