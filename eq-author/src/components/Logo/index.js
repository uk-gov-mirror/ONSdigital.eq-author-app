import React from "react";

import styled from "styled-components";

import { Link } from "react-router-dom";

import logo from "components/Header/logo.svg";

export const Logo = styled(Link)`
  width: 5.5em;
  display: flex;
  align-items: center;
  margin: 1.5em 1em;
`;

const LogoImg = styled.img`
  display: inline-block;
  width: 100%;
  height: auto;
`;

export default () => (
  <Logo to="/" data-test="logo">
    <LogoImg src={logo} alt="Author" width={20} />
  </Logo>
);
