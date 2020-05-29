import React from "react";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";

// Components
// ------------------------------------------------
import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Grid } from "components/Grid";
import MainCanvas from "components/MainCanvas";
import Panel from "components/Panel";
import ShareContent from "./SharePageContent";
// ------------------------------------------------

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

const SharePage = props => {
  const { questionnaireId } = props.match.params;
  return (
    <Container>
      <Header title="Sharing" />
      <StyledGrid>
        <ScrollPane permanentScrollBar data-test="sharing-page-content">
          <StyledMainCanvas>
            <Panel>
              <ShareContent questionnaireId={questionnaireId} />
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
