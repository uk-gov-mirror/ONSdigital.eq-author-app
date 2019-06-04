import React from "react";

import styled from "styled-components";
import { colors } from "constants/theme";
import Truncated from "components/Truncated";

const PageTitle = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: pre;
  background: ${colors.primary};
  color: ${colors.white};
  padding: 0 1.5em 1em;
`;

const Title = styled.h1`
  font-size: 1.5em;
  font-weight: 600;
  margin: 0;
  width: 100%;
  line-height: 1.3;
`;

export default ({ children }) => (
  <PageTitle>
    <Truncated>
      <Title data-test="questionnaire-title">{children}&nbsp;</Title>
    </Truncated>
  </PageTitle>
);
