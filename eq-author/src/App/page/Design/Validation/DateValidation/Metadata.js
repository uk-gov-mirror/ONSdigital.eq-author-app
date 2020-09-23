import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import MetadataContentPicker from "../MetadataContentPicker";
import * as entityTypes from "constants/validation-entity-types";

const Metadata = (answer, onChangeUpdate, validation, readKey) => (
  <MetadataContentPicker
    answerId={answer.id}
    onSubmit={onChangeUpdate}
    selectedContentDisplayName={get(validation.metadata, "displayName")}
    path={`answer.validation.${readKey}.availableMetadata`}
  />
);

Metadata.propTypes = {
  validation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    custom: PropTypes.number,
    inclusive: PropTypes.bool.isRequired,
    previousAnswer: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
    entityType: PropTypes.oneOf(Object.values(entityTypes)),
  }).isRequired,
  answer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      unit: PropTypes.string,
    }),
    validationErrorInfo: PropTypes.shape({
      errors: PropTypes.arrayOf(
        PropTypes.shape({
          errorCode: PropTypes.string,
          field: PropTypes.string,
          id: PropTypes.string,
          type: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
  readKey: PropTypes.string.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
};

export default Metadata;
