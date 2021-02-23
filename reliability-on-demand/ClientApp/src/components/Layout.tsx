import React, { Component, ReactElement } from "react";
import { Container } from "reactstrap";
import { NavMenu } from "./NavMenu";

interface Props {
  children:ReactElement
}

export const Layout = (props: Props) => {
  return (
    <div>
      <NavMenu />
      <Container>{props.children}</Container>
    </div>
  );
};
