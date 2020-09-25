import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { flowRight, find } from "lodash";

import { Select } from "components/Forms";
import { Grid, Column } from "components/Grid";

import { ValidationPills } from "../ValidationPills";
import Path from "../path.svg?inline";
import PathEnd from "../path-end.svg?inline";
import EmphasisedText from "../EmphasisedText";
import AlignedColumn from "../AlignedColumn";
import Duration from "../Duration";
import ValidationError from "components/ValidationError";
import { ERR_NO_VALUE } from "constants/validationMessages";

import withChangeUpdate from "enhancers/withChangeUpdate";

import { DATE, DATE_RANGE } from "constants/answer-types";
import { DAYS, MONTHS, YEARS } from "constants/durations";

import MetadataContentPicker from "./MetadataContentPicker";
import CustomEditor from "./CustomEditor";
import PreviousAnswerEditor from "./PreviousAnswerEditor";

const UNITS = [DAYS, MONTHS, YEARS];
const RELATIVE_POSITIONS = ["before", "after"];

const ConnectedPath = styled(Path)`
  height: 3.6em;
`;

const RelativePositionSelect = styled(Select)`
  width: 6em;
`;

const RelativePositionText = styled(EmphasisedText)`
  margin-top: 0.5em;
  margin-bottom: 0.5em;
`;

const StartDateText = styled.div`
  margin: 0;
  padding-top: 0.5em;
  height: 2.5em;
`;

const StyledError = styled(ValidationError)`
  justify-content: start;
  width: 60%;
`;

const START_COL_SIZE = 3;
const END_COL_SIZE = 12 - START_COL_SIZE;

const getUnits = ({ format, type }) => {
  if (type === DATE_RANGE) {
    return UNITS;
  }

  if (format === "dd/mm/yyyy") {
    return UNITS;
  }

  if (format === "mm/yyyy") {
    return UNITS.slice(1);
  }

  return UNITS.slice(2);
};

const Now = () => (
  <StartDateText>The date the respondent begins the survey</StartDateText>
);

const UnwrappedDateValidation = ({
  answer: {
    properties: { format },
    type,
  },
  answer,
  displayName,
  onChange,
  onUpdate,
  onSubmit,
  onChangeUpdate,
  validation,
  validation: { offset, relativePosition, entityType },
  readKey,
}) => {
  const availableUnits = getUnits({ format, type });

  const hasError = find(validation.validationErrorInfo.errors, error =>
    error.errorCode.includes("ERR_NO_VALUE")
  );

  const handleError = () => {
    return <StyledError>{ERR_NO_VALUE}</StyledError>;
  };

  return (
    <div>
      <Grid>
        <AlignedColumn cols={START_COL_SIZE}>
          <EmphasisedText>{displayName} is</EmphasisedText>
        </AlignedColumn>
        <Column cols={END_COL_SIZE}>
          <Duration
            name="offset"
            duration={offset}
            value={offset.unit}
            units={availableUnits}
            onChange={onChange}
            onUpdate={onUpdate}
            hasError={hasError}
          />
        </Column>
      </Grid>
      <Grid>
        <Column cols={START_COL_SIZE}>
          <ConnectedPath />
        </Column>
        <Column cols={END_COL_SIZE}>{hasError && handleError()}</Column>
      </Grid>
      <Grid>
        <AlignedColumn cols={START_COL_SIZE}>
          {type === DATE && (
            <RelativePositionSelect
              name="relativePosition"
              value={relativePosition}
              onChange={onChange}
              onBlur={onUpdate}
              data-test="relative-position-select"
            >
              {RELATIVE_POSITIONS.map(position => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </RelativePositionSelect>
          )}
          {type === DATE_RANGE && (
            <RelativePositionText>
              {relativePosition.toLowerCase()}
            </RelativePositionText>
          )}
          <PathEnd />
        </AlignedColumn>
        <Column cols={9}>
          <ValidationPills
            answer={answer}
            displayName={displayName}
            entityType={entityType}
            format={format}
            offset={offset}
            onEntityTypeChange={onChangeUpdate}
            onChange={onChange}
            onChangeUpdate={onChangeUpdate}
            onSubmit={onSubmit}
            onUpdate={onUpdate}
            path={`answer.validation.${readKey}.availablePreviousAnswers`}
            readKey={readKey}
            relativePosition={relativePosition}
            type={type}
            validation={validation}
            Metadata={MetadataContentPicker}
            Custom={CustomEditor}
            {...(type === DATE
              ? {
                  PreviousAnswer: PreviousAnswerEditor,
                  Now: Now,
                }
              : {})}
          />
        </Column>
      </Grid>
    </div>
  );
};

UnwrappedDateValidation.propTypes = {
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
  }).isRequired,
  answer: PropTypes.shape({
    id: PropTypes.string.required,
    properties: PropTypes.shape({
      format: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onToggleValidationRule: PropTypes.func.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  readKey: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};

export default flowRight(withChangeUpdate)(UnwrappedDateValidation);
