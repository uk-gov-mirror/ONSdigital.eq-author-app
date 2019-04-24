import React, { useState } from "react";
import { find, get } from "lodash";
import styled from "styled-components";

import { colors } from "constants/theme";

import Truncated from "components/Truncated";
import ScrollPane from "components/ScrollPane";
import {
  MenuItemList,
  ParentMenuItem,
  SubMenuItem,
  MenuItemTitles,
  MenuItemTitle,
  MenuItemSubtitle,
} from "./Menu";

import IconPage from "./icon-page.svg?inline";
import { UNSELECTED } from ".";

const ModalTitle = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  color: ${colors.textLight};
`;

const ModalHeader = styled.div`
  padding: 2em 1em;
  border-bottom: 1px solid ${colors.bordersLight};
`;

const MenuContainer = styled.div`
  overflow: hidden;
  height: 25em;
`;

const Columns = styled.div`
  display: flex;
  height: 100%;
`;

const Column = styled.div`
  width: 50%;
`;

const ContentIcon = styled(IconPage)`
  opacity: 0.3;
  position: relative;
  left: -5px;
`;

const ContentWrapper = styled.div`
  padding: 1.5em;
`;

const ContentTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  margin: 0 0 0.5em;
`;

const ContentText = styled.p`
  margin: 0;
  font-size: 1rem;
`;

const NextPageContent = () => (
  <ContentWrapper>
    <ContentIcon />
    <ContentTitle>Next page</ContentTitle>
    <ContentText>
      The user will be taken to the next page in the questionnaire.
    </ContentText>
  </ContentWrapper>
);

const EndContent = () => (
  <ContentWrapper>
    <ContentIcon />
    <ContentTitle>End of questionnaire</ContentTitle>
    <ContentText>
      The user will be taken to the last page in the questionnaire.
    </ContentText>
  </ContentWrapper>
);

const isSelected = (selectedItem, currentItem) => {
  if (!selectedItem) {
    return false;
  }

  if (get(selectedItem, "logical") === currentItem.id) {
    return true;
  }

  if (selectedItem.page) {
    return selectedItem.page.id === currentItem.id;
  } else if (selectedItem.section) {
    return selectedItem.section.id === currentItem.id;
  }

  return selectedItem.id === currentItem.id;
};

const DestinationPicker = ({
  data,
  selectedItem,
  onSelected,
  onUnselected,
}) => {
  const { pages, sections, logicalDestinations } = data;
  const [nextPage, endOfQuestionnaire] = logicalDestinations;

  let defaultSelectedSection;

  if (logicalDestinations.includes(selectedItem)) {
    defaultSelectedSection = null;
  } else {
    if (selectedItem.page) {
      defaultSelectedSection = pages;
    } else if (selectedItem.section) {
      defaultSelectedSection = sections;
    }
  }

  const [selectedSection, setSelectedSection] = useState(
    defaultSelectedSection
  );

  return (
    <>
      <ModalHeader>
        <ModalTitle>Select a destination</ModalTitle>
      </ModalHeader>
      <MenuContainer>
        <Columns>
          <Column>
            <ScrollPane background permanentScrollBar>
              <MenuItemList>
                <SubMenuItem
                  onClick={() => {
                    onSelected(nextPage);
                    setSelectedSection(null);
                  }}
                  aria-selected={
                    selectedSection ? false : isSelected(selectedItem, nextPage)
                  }
                >
                  <MenuItemTitles>
                    <MenuItemTitle>Next page</MenuItemTitle>
                    <MenuItemSubtitle>
                      Adipiscing Mattis Dapibus Vulputate
                    </MenuItemSubtitle>
                  </MenuItemTitles>
                </SubMenuItem>
                <ParentMenuItem
                  onClick={() => {
                    onUnselected();
                    setSelectedSection(pages);
                  }}
                  aria-selected={selectedSection === pages}
                  disabled={pages.length === 0}
                >
                  Other pages in this section
                </ParentMenuItem>
                <ParentMenuItem
                  onClick={() => {
                    onUnselected();
                    setSelectedSection(sections);
                  }}
                  aria-selected={selectedSection === sections}
                  disabled={sections.length === 0}
                >
                  Other sections
                </ParentMenuItem>
                <SubMenuItem
                  onClick={() => {
                    onSelected(endOfQuestionnaire);
                    setSelectedSection(null);
                  }}
                  aria-selected={
                    selectedSection
                      ? false
                      : isSelected(selectedItem, endOfQuestionnaire)
                  }
                >
                  End of questionnaire
                </SubMenuItem>
              </MenuItemList>
            </ScrollPane>
          </Column>
          <Column>
            {selectedSection ? (
              <ScrollPane background permanentScrollBar>
                <MenuItemList>
                  {selectedSection.map(page => (
                    <SubMenuItem
                      key={page.id}
                      aria-selected={isSelected(selectedItem, page)}
                      onClick={() => onSelected(page)}
                    >
                      <Truncated>{page.displayName}</Truncated>
                    </SubMenuItem>
                  ))}
                </MenuItemList>
              </ScrollPane>
            ) : isSelected(selectedItem, nextPage) ? (
              <NextPageContent />
            ) : (
              <EndContent />
            )}
          </Column>
        </Columns>
      </MenuContainer>
    </>
  );
};

export default DestinationPicker;
