import React from "react";
import PropTypes from "prop-types";

const FieldMessage = ({ message }) => {
  if (!message) {
    return false;
  }

  return <div>{message}</div>;
};

FieldMessage.propTypes = {
  message: PropTypes.string,
};

export default FieldMessage;
