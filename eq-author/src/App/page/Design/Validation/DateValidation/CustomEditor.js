import React from "react";
import PropTypes from "prop-types";
import * as entityTypes from "constants/validation-entity-types";

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

Custom.propTypes = {
  validation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    customDate: PropTypes.string,
    previousAnswer: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
    metadata: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
    offset: PropTypes.shape({
      unit: PropTypes.string.isRequired,
      value: PropTypes.number,
    }).isRequired,
    relativePosition: PropTypes.string.isRequired,
    entityType: PropTypes.oneOf(Object.values(entityTypes)).isRequired,
  }).isRequired,
  answer: PropTypes.shape({
    id: PropTypes.string.required,
    properties: PropTypes.shape({
      format: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  readKey: PropTypes.string.isRequired,
};

export default Custom;
