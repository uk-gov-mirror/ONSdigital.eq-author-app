import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import ContentPickerSelect from "components/ContentPickerSelect";
import { VARIABLES } from "components/ContentPickerSelect/content-types";

export const UnwrappedVariableContentPicker = ({
  data,
  path,
  ...otherProps
}) => (
  <ContentPickerSelect
    name="variable"
    contentTypes={[VARIABLES]}
    variableData={get(data, path)}
    {...otherProps}
  />
);

export default UnwrappedVariableContentPicker;