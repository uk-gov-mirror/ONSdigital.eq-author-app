import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { colors } from "constants/theme";
import ScrollPane from "components/ScrollPane";
import { flowRight, map, find, get, slice } from "lodash";
import { withRouter } from "react-router";
import gql from "graphql-tag";
import { connect } from "react-redux";
import withUpdateQuestionnaire from "./withUpdateQuestionnaire";

import SectionNav from "./SectionNav";
import NavigationHeader from "./NavigationHeader";

import { addSummaryPage } from "redux/summary";
import { buildPagePath } from "utils/UrlUtils";

const Container = styled.div`
  background: ${colors.darkBlue};
  color: ${colors.white};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const NavigationScrollPane = styled(ScrollPane)`
  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${colors.lightGrey};
    }
  }
`;

let pageId = 9999999;
const getNewPageId = () => {
  pageId--;
  return pageId.toString();
};

export class UnwrappedNavigationSidebar extends Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire,
    onAddPage: PropTypes.func.isRequired,
    onAddSection: PropTypes.func.isRequired,
    onAddQuestionConfirmation: PropTypes.func.isRequired,
    onUpdateQuestionnaire: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    canAddQuestionConfirmation: PropTypes.bool.isRequired,
  };

  handleAddSection = () => {
    this.props.onAddSection(this.props.questionnaire.id);
  };

  render() {
    const {
      questionnaire,
      onUpdateQuestionnaire,
      onAddPage,
      onAddSummaryPage,
      onAddQuestionConfirmation,
      canAddQuestionConfirmation,
      summary,
      loading,
    } = this.props;

    return (
      <Container data-test="side-nav">
        {loading ? null : (
          <React.Fragment>
            <NavigationHeader
              questionnaire={questionnaire}
              onUpdateQuestionnaire={onUpdateQuestionnaire}
              onAddSection={this.handleAddSection}
              onAddPage={onAddPage}
              onAddSummaryPage={onAddSummaryPage}
              onAddQuestionConfirmation={onAddQuestionConfirmation}
              canAddQuestionConfirmation={canAddQuestionConfirmation}
              data-test="nav-section-header"
            />
            <NavigationScrollPane>
              <SectionNav questionnaire={questionnaire} />
            </NavigationScrollPane>
          </React.Fragment>
        )}
      </Container>
    );
  }
}

UnwrappedNavigationSidebar.fragments = {
  NavigationSidebar: gql`
    fragment NavigationSidebar on Questionnaire {
      id
      ...SectionNav
      ...NavigationHeader
    }

    ${NavigationHeader.fragments.NavigationHeader}
    ${SectionNav.fragments.SectionNav}
  `,
};

const mapDispatch = (dispatch, ownProps) => {
  const { questionnaire, match, loading } = ownProps;
  const { pageId, sectionId, questionnaireId } = match.params;

  let position = 0;

  if (questionnaire && pageId && !loading) {
    const section = find(questionnaire.sections, { id: sectionId });
    const page = find(section.pages, { id: pageId });
    if (page) {
      position = page.position + 1;
    }
  }

  return {
    onAddSummaryPage: () => {
      const newPageId = getNewPageId();
      dispatch(
        addSummaryPage({
          questionnaireId,
          sectionId,
          pageId: newPageId,
          position,
        })
      );

      ownProps.history.push(
        buildPagePath({
          questionnaireId,
          sectionId,
          pageId: newPageId,
        })
      );
    },
  };
};

export default flowRight(
  withRouter,
  withUpdateQuestionnaire,
  connect(
    null,
    mapDispatch
  )
)(UnwrappedNavigationSidebar);
