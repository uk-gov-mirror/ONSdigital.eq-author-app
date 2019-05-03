import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import App from "./App";
import Header from "components/Header";
import { Titled } from "react-titled";

import ConnectedOfflineBanner from "components/OfflineBanner";

import CustomPropTypes from "custom-prop-types";
import { colors } from "constants/theme";

import ToastContainer from "components/ToastContainer";

const Wrapper = styled.div`
  background-color: ${colors.lighterGrey};
  height: 100vh;
  min-width: 80em;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const Title = styled.h1`
  font-size: 1.4em;
  font-weight: 700;
  margin: 2em 0;
  text-align: center;
`;

const BaseLayout = ({ children, title, questionnaire }) => (
  <Titled title={() => title}>
    <App>
      <Wrapper>
        <Header title={title} questionnaire={questionnaire} />
        <ConnectedOfflineBanner />
        <Main>{children}</Main>
        {ReactDOM.createPortal(
          <ToastContainer />,
          document.getElementById("toast")
        )}
      </Wrapper>
    </App>
  </Titled>
);

BaseLayout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  questionnaire: CustomPropTypes.questionnaire,
};

export default BaseLayout;
