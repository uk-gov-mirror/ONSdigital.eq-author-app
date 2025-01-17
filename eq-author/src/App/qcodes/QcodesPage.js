import React from "react";
import styled from "styled-components";

import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Grid } from "components/Grid";
import MainCanvas from "components/MainCanvas";
import QcodesTable from "./QCodesTable";

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

const QcodesPage = () => (
  <Container>
    <Header title="QCodes" />
    <StyledGrid>
      <ScrollPane>
        <StyledMainCanvas>
          <QcodesTable />
        </StyledMainCanvas>
      </ScrollPane>
    </StyledGrid>
  </Container>
);

export default QcodesPage;
