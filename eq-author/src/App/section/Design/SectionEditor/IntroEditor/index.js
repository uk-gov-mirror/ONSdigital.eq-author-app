import React from "react";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import styled from "styled-components";
import { flip, partial, flowRight } from "lodash";
import { connect } from "react-redux";

import { raiseToast } from "redux/toast/actions";

import MainCanvas from "components/MainCanvas";

import RichTextEditor from "components/RichTextEditor";

import { colors, radius } from "constants/theme";

import withDeleteSectionIntro from "./withDeleteSectionIntro";

const Fieldset = styled.fieldset`
  border: none;
  padding: 0;
`;

const Legend = styled.legend`
  display: block;
  margin-bottom: 0.4em;
  font-weight: 600;
  font-size: 1em;
  line-height: 1.4;
  color: ${colors.textLight};
`;

const StyledMainCanvas = styled(MainCanvas)`
  padding: 0 2em 1em;
`;

export const IntroCanvas = styled.div`
  padding: 1.5em 1.5em 0;
  border: 1px solid ${colors.bordersLight};
  background-color: ${colors.white};
  border-radius: ${radius};
`;

const Small = styled.small`
  font-weight: normal;
  font-size: 0.9em;
  &::before {
    content: "";
    display: block;
  }
`;

export const ENABLE_INTRO = { name: "introductionEnabled", value: true };

export class UnwrappedIntroEditor extends React.Component {
  handleDeleteSectionIntroduction = () => {
    const { section, onDeleteSectionIntro } = this.props;
    onDeleteSectionIntro(section);
  };

  handleEnableSectionIntroduction = () => {
    const { onUpdate, onChange } = this.props;
    onChange(ENABLE_INTRO, onUpdate);
  };

  hasIntro() {
    return this.props.section.introductionEnabled;
  }

  render() {
    const { section, onUpdate, onChange } = this.props;
    const handleUpdate = partial(flip(onChange), onUpdate);
    return (
      <StyledMainCanvas data-test="section-intro-canvas">
        <Fieldset>
          <Legend>
            Section introduction
            <Small>
              If you do not want an introduction page, leave these blank
            </Small>
          </Legend>
          <IntroCanvas>
            <RichTextEditor
              id="introduction-title"
              label="Introduction title"
              name="introductionTitle"
              onUpdate={handleUpdate}
              size="large"
              testSelector="txt-introduction-title"
              value={section.introductionTitle}
              controls={{ piping: true }}
            />
            <RichTextEditor
              id="introduction-content"
              label="Introduction content"
              onUpdate={handleUpdate}
              name="introductionContent"
              multiline
              testSelector="txt-introduction-content"
              value={section.introductionContent}
              controls={{
                heading: true,
                bold: true,
                list: true,
                piping: true,
                emphasis: true,
              }}
            />
          </IntroCanvas>
        </Fieldset>
      </StyledMainCanvas>
    );
  }
}

UnwrappedIntroEditor.propTypes = {
  section: CustomPropTypes.section.isRequired,
  onUpdate: PropTypes.func,
  onChange: PropTypes.func,
  onDeleteSectionIntro: PropTypes.func.isRequired,
};

const wrappedSectionIntro = flowRight(
  connect(
    null,
    { raiseToast }
  ),
  withDeleteSectionIntro
)(UnwrappedIntroEditor);

export default wrappedSectionIntro;
