import React from "react";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";
import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Grid } from "components/Grid";
import MainCanvas from "components/MainCanvas";
import Panel from "components/Panel";

import { colors } from "constants/theme";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledGrid = styled(Grid)`
  overflow: hidden;
  padding-top: 2em;
`;

const StyledMainCanvas = styled(MainCanvas)`
  padding: 0 0.5em 0 1em;
  max-width: 80em;
`;

const ShareLayout = styled.div`
  padding: 2em;
`;

const PageTitle = styled.h2`
  font-size: 1.1em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 1em;
`;
const SectionTitle = styled.h3`
  font-size: 1.1em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 1em;
`;
const PageDescription = styled.p`
  margin: 0.1em 0 1em;
  color: ${colors.textLight};
`;

const PageSection = styled.div`
  &:not(:last-of-type) {
    border-bottom: 1px solid #e0e0e0;
  }
  &:first-of-type {
    border-top: 1px solid #e0e0e0;
  }
`;

const SharePage = ({ match }) => {
  return (
    <Container>
      <Header title="Sharing" />
      <StyledGrid>
        <ScrollPane permanentScrollBar data-test="sharing-page-content">
          <StyledMainCanvas>
            <Panel>
              <ShareLayout>
                {/* Page title */}
                <PageTitle>Share your questionnaire</PageTitle>
                {/* Page description */}
                <PageDescription>
                  You can share your questionnaire with anyone who has an
                  account with Author.
                </PageDescription>
                {/* Section One */}
                <PageSection>
                  <SectionTitle>Public access</SectionTitle>
                  {/* Public access */}
                </PageSection>
                {/* Section Two */}
                <PageSection>
                  <SectionTitle>Editors</SectionTitle>
                  <SectionTitle>Add Editors</SectionTitle>
                  {/* Editors */}
                  {/* Add Editors */}
                </PageSection>
              </ShareLayout>
            </Panel>
          </StyledMainCanvas>
        </ScrollPane>
      </StyledGrid>
    </Container>
  );
};

SharePage.propTypes = {
  match: CustomPropTypes.match.isRequired,
};

export default SharePage;
