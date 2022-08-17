import * as React from "react"
import { Container } from "reactstrap"
import { NavMenu } from "./NavMenu/NavMenu"

interface Props {
    children: React.ReactElement
}

export const Layout = (props: Props) => {
    return (
        <div>
            <NavMenu />
            <Container>{props.children}</Container>
        </div>
    )
}
