/* eslint-disable react/no-danger */
import PropTypes from "prop-types";
import React from "react";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";

import Loading from "components/Loading";

import QuestionPageEditor from "App/page/Design/QuestionPageEditor";
import CalculatedSummaryPageEditor from "App/page/Design/CalculatedSummaryPageEditor";

import QuestionPagePreview from "./QuestionPagePreview";
import CalculatedSummaryPreview from "./CalculatedSummaryPreview";

export const UnwrappedPreviewPageRoute = props => {
  const { loading, data } = props;
  if (loading) {
    return <Loading height="38rem">Preview loading…</Loading>;
  }

  const { page } = data;
  if (page.pageType === "QuestionPage") {
    return <QuestionPagePreview page={page} />;
  }
  if (page.pageType === "CalculatedSummaryPage") {
    return <CalculatedSummaryPreview page={page} />;
  }
};

UnwrappedPreviewPageRoute.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    questionPage: propType(QuestionPageEditor.fragments.QuestionPage),
  }),
};

export const PAGE_QUERY = gql`
  query GetPage($input: QueryInput!) {
    page(input: $input) {
      ...QuestionPage
      ...CalculatedSummaryPage
    }
  }
  ${QuestionPageEditor.fragments.QuestionPage}
  ${CalculatedSummaryPageEditor.fragments.CalculatedSummaryPage}
`;

export default withApollo(props => (
  <Query
    query={PAGE_QUERY}
    variables={{
      input: {
        pageId: props.match.params.pageId,
        questionnaireId: props.match.params.questionnaireId,
      },
    }}
  >
    {innerProps => <UnwrappedPreviewPageRoute {...innerProps} {...props} />}
  </Query>
));
