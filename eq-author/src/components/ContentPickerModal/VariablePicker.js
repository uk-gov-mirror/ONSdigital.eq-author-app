import React from "react";

import styled from "styled-components";

import { colors } from "constants/theme";
import { SubMenuItem, MenuItemType } from "./Menu";

import ScrollPane from "components/ScrollPane";

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

const Table = styled.div`
  display: table;
  width: 100%;
`;

const TableHeader = styled.div`
  display: table-header-group;
  background: #f4f5f6;
  font-size: 11px;
  padding: 0.3rem 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: bold;
  color: #666;
  line-height: 1.1;
`;

const Col = styled.div`
  display: table-cell;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #d8d8d8;
`;

const TableHeadCol = styled.div`
  display: table-cell;
  padding: 0.5rem 1rem;
`;

const MetaDataItem = styled(SubMenuItem)`
  display: table-row;
  height: 2em;
`;

const MetaDataItemList = styled.ul`
  display: table-row-group;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const VariablePicker = ({ data, selectedItem, onSelected }) => {
  return (
    <>
      <ModalHeader>
        <ModalTitle>Select variable</ModalTitle>
      </ModalHeader>
      <MenuContainer>
        <ScrollPane>
          <Table>
            <TableHeader>
              <TableHeadCol>Name</TableHeadCol>
              <TableHeadCol>Description</TableHeadCol>
              <TableHeadCol>Type</TableHeadCol>
            </TableHeader>
            <MetaDataItemList>
              {data.map(variable => (
                <MetaDataItem
                  key={variable.id}
                  onClick={() => onSelected(variable)}
                  aria-selected={
                    selectedItem && selectedItem.id === variable.id
                  }
                  aria-label={variable.key}
                >
                  <Col>{variable.displayName}</Col>
                  <Col>{variable.description}</Col>
                  <Col>
                    <MenuItemType>{variable.type}</MenuItemType>
                  </Col>
                </MetaDataItem>
              ))}
            </MetaDataItemList>
          </Table>
        </ScrollPane>
      </MenuContainer>
    </>
  );
};

export default VariablePicker;
