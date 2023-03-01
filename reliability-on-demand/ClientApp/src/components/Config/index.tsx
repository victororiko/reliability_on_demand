import React from "react"
import { Loading } from "../helpers/Loading"
import { MessageBox } from "../helpers/MessageBox"
import { UnAuthorizedMessage } from "../helpers/utils"
import { ConfigPage } from "./ConfigPage"
import { useCosRelDataMemberVerificationQuery } from "./service"

interface IConfigProps {}

export const Config = (props: IConfigProps) => {
    const { isError, error, isLoading, data } = useCosRelDataMemberVerificationQuery()

    if (isError) return <MessageBox message={`${JSON.stringify(error)}`} />
    if (isLoading)
        return <Loading message="Hang tight - Making sure you're allowed to view this page." />

    return <div>{data ? <ConfigPage /> : <MessageBox message={UnAuthorizedMessage} />}</div>
}
