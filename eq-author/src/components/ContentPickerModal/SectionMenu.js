import React, { useState } from "react";

import { Menu, SubMenu } from "./Menu";
import styled from "styled-components";
import ScrollPane from "components/ScrollPane";
import { find } from "lodash";

const Columns = styled.div`
  display: flex;
  height: 100%;
`;

const Column = styled.div`
  width: 50%;
`;

const SectionMenu = ({
  data,
  selectedItem,
  onSelected,
  isSelected,
  ...otherProps
}) => {
  const defaultSelected = selectedItem
    ? find(data, {
        pages: [{ answers: [{ id: selectedItem.id }] }],
      })
    : undefined;

  const [selectedSection, setSelectedSection] = useState(defaultSelected);

  return (
    <Columns>
      <Column>
        <ScrollPane background permanentScrollBar>
          <Menu
            data={data}
            {...otherProps}
            onSelected={setSelectedSection}
            isSelected={item =>
              selectedSection && selectedSection.id === item.id
            }
          />
        </ScrollPane>
      </Column>
      <Column>
        {selectedSection ? (
          <ScrollPane background permanentScrollBar>
            <SubMenu
              data={selectedSection.pages}
              onSelected={onSelected}
              isSelected={isSelected}
              {...otherProps}
            />
          </ScrollPane>
        ) : null}
      </Column>
    </Columns>
  );
};

export default SectionMenu;
