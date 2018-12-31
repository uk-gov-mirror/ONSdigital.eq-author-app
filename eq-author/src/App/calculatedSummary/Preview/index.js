/* eslint-disable react/no-danger */
import PropTypes from "prop-types";
import React from "react";

import { propType } from "graphql-anywhere";
import styled from "styled-components";
import { flowRight } from "lodash";
import Error from "components/preview/Error";
import PageTitle from "components/preview/elements/PageTitle";
import Info from "components/preview/elements/Info";

import EditorLayout from "App/questionPage/Design/EditorLayout";
import QuestionPageEditor from "App/questionPage/Design/QuestionPageEditor";

import { withRouter } from "react-router";
import withSummary from "./../withSummary";

import { Grid, Column } from "components/Grid";

import { colors } from "constants/theme";

const Container = styled.div`
  padding: 2em;
  max-width: 35em;
  font-size: 1.1em;
  p {
    margin: 0 0 1em;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
  em {
    background-color: #dce5b0;
    padding: 0 0.125em;
    font-style: normal;
  }
  span[data-piped] {
    background-color: #e0e0e0;
    padding: 0 0.125em;
    border-radius: 4px;
    white-space: pre;
  }
`;

const Summary = styled.div`
  border-bottom: 1px solid #999;
  margin-bottom: 2rem;
`;

const SummaryItem = styled.div`
  border-top: 1px solid #999;
  border-radius: 0;
  position: relative;
  padding: 1rem 0;
`;

const SummaryLabel = styled.div`
  font-weight: normal;
`;

const SummaryValue = styled.div`
  background: #e0e0e0;
  color: ${colors.textLight};
  line-height: 1;
  padding: 0.2em 0.5em;
  text-align: center;
  font-size: 0.8em;
  font-weight: bold;
  display: inline;
  border-radius: 4px;
`;

const SummaryLink = styled.div`
  color: ${colors.primary};
  text-align: right;
  text-decoration: underline;
`;

const SummaryTotal = styled(SummaryItem)`
  font-size: 1.2em;
`;

const SummaryTotalLabel = styled.div`
  font-weight: bold;
`;

export const UnwrappedPreviewPageRoute = ({ page }) => {
  return (
    <EditorLayout page={page} preview routing={false}>
      <Container>
        <PageTitle title={page.title} />
        <Info>Please review your answers and confirm these are correct.</Info>

        {page.answers.length > 0 ? (
          <Summary>
            {page.answers.map(answer => (
              <SummaryItem key={answer.id}>
                <Grid>
                  <Column cols={7}>
                    <SummaryLabel>{answer.label}</SummaryLabel>
                  </Column>
                  <Column cols={3}>
                    <SummaryValue>Value</SummaryValue>
                  </Column>
                  <Column cols={2}>
                    <SummaryLink>Change</SummaryLink>
                  </Column>
                </Grid>
              </SummaryItem>
            ))}

            {page.totalTitle ? (
              <SummaryTotal>
                <Grid>
                  <Column cols={7}>
                    <SummaryTotalLabel
                      dangerouslySetInnerHTML={{ __html: page.totalTitle }}
                    />
                  </Column>
                  <Column cols={3}>
                    <SummaryValue>Value</SummaryValue>
                  </Column>
                  <Column cols={2} />
                </Grid>
              </SummaryTotal>
            ) : (
              <Error large>Missing total title</Error>
            )}
          </Summary>
        ) : (
          <Error large>No answers selected</Error>
        )}
      </Container>
    </EditorLayout>
  );
};

UnwrappedPreviewPageRoute.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    questionPage: propType(QuestionPageEditor.fragments.QuestionPage),
  }),
};

export default flowRight(
  withRouter,
  withSummary
)(UnwrappedPreviewPageRoute);
