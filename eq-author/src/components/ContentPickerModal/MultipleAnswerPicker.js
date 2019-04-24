import React from "react";
import styled from "styled-components";

import { colors } from "constants/theme";

import { FlatSectionMenu } from "./Menu";
import ScrollPane from "components/ScrollPane";
import { find, first, get } from "lodash";

const ModalTitle = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  color: ${colors.textLight};
  margin-bottom: 0.2em;
`;

const ModalSubtitle = styled.div`
  font-size: 1em;
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

const Types = styled.div`
  display: flex;
  align-items: center;
`;

export const Type = styled.span`
  font-size: 10px;
  background: #e4e8eb;
  padding: 0.3em 0.7em;
  border-radius: 1em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #333;
  flex: 0 1 auto;
  justify-self: flex-end;
  margin-left: 0.5em;
`;

const AnswerPicker = ({
  onSelected,
  selectedItems,
  validTypes,
  ...otherProps
}) => (
  <>
    <ModalHeader>
      <ModalTitle>Select one or more answer</ModalTitle>
      <ModalSubtitle>
        <Types>
          <span>Allowed answer types:</span>
          {validTypes.map(type => (
            <Type key={type}>{type}</Type>
          ))}
        </Types>
      </ModalSubtitle>
    </ModalHeader>
    <MenuContainer>
      <ScrollPane>
        <FlatSectionMenu
          onSelected={onSelected}
          isSelected={({ id }) => Boolean(find(selectedItems, { id }))}
          isDisabled={({ type }) => {
            const answerType = get(first(selectedItems), "type");

            if (!validTypes.includes(type)) {
              return true;
            }

            if (!answerType) {
              return false;
            } else {
              return answerType !== type;
            }
          }}
          {...otherProps}
        />
      </ScrollPane>
    </MenuContainer>
  </>
);

export default AnswerPicker;
