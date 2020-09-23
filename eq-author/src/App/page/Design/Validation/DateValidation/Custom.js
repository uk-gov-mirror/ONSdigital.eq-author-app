import React from "react";

import { Input } from "components/Forms";
import styled from "styled-components";

const DateInput = styled(Input)`
  width: 12em;
  height: 2.5em;
`;

const Custom = ({ validation, onChange, onUpdate }) => (
  <DateInput
    name="customDate"
    type="date"
    value={validation.customDate}
    onChange={onChange}
    onBlur={onUpdate}
    max="9999-12-30"
    min="1000-01-01"
  />
);

export default Custom;
