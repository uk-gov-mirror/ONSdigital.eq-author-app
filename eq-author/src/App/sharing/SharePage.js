import React from "react";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";
import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Grid } from "components/Grid";
import MainCanvas from "components/MainCanvas";
import Panel from "components/Panel";

import { Field } from "components/Forms";
import { UncontrolledInput } from "components/Forms/Input";

import { colors } from "constants/theme";
// Boiler plate structure
// ------------------------------------------------
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
// ------------------------------------------------
//
// Basic styling
// Tidy up once everything is sorted
// Want to isolate components that could be reusable
// ------------------------------------------------
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
  padding: 2em 0;
  &:first-of-type {
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }
`;

const SearchInput = styled(UncontrolledInput)`
  padding: 0.5em;
  font-size: 1em;
  width: 100%;
  border: 1px solid ${colors.borders};
`;

const InsetText = styled.div`
  border-left: 10px solid #033e58;
  background: #eff0f9;
  padding: 1em;
`;

const SearchContainer = styled.div`
  margin: 0 0 2em;
  background: #ebeef0;
  height: 100%;
  padding: 1em 1em 0.3em;
`;
// ------------------------------------------------
const SharePage = ({ match }) => {
  return (
    <Container>
      <Header title="Sharing" />
      <StyledGrid>
        <ScrollPane permanentScrollBar data-test="sharing-page-content">
          <StyledMainCanvas>
            <Panel>
              <ShareLayout>
                <PageTitle>Share your questionnaire</PageTitle>
                <PageDescription>
                  You can share your questionnaire with anyone who has an
                  account with Author.
                  {/* Need to add link here */}
                  <div>get shareable link goes here</div>
                </PageDescription>
                <PageSection>
                  <SectionTitle>Public access</SectionTitle>

                  {/* Banner goes here */}
                  <InsetText>
                    Let anyone with an Author account view your questionnaire.
                    If public access is off, only editors
                  </InsetText>

                  {/* Banner goes here */}
                  {/* Public access */}
                </PageSection>
                <PageSection>
                  <SectionTitle>Editors</SectionTitle>
                  <InsetText>
                    Editors can edit questionnaire content, add comments, delete
                    the questionnaire and add other editors.
                  </InsetText>
                </PageSection>
                <PageSection>
                  <SectionTitle>Add Editors</SectionTitle>
                  Search for someone using their name or email address.
                  <SearchContainer>
                    <Field>
                      <SearchInput placeholder="Tom is cool" />
                      {/* Add button here */}
                    </Field>
                  </SearchContainer>
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
