import React from "react";

import styled from "styled-components";

const StartDateText = styled.div`
  margin: 0;
  padding-top: 0.5em;
  height: 2.5em;
`;

const Now = () => (
  <StartDateText>The date the respondent begins the survey</StartDateText>
);

export default Now;
