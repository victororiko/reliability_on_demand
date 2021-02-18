import React from "react";
import { Container } from "reactstrap";
import { NavMenu } from "./NavMenu";

interface Props {
  children:[]
}

export const Layout = (props: Props) => {
  return (
    <div>
      <NavMenu />
      <Container>{props.children}</Container>
    </div>
  );
};
