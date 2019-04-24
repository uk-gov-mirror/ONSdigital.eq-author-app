import React from "react";

import styled from "styled-components";
import { colors } from "constants/theme";
import iconChevron from "./icon-chevron-small.svg";
import Truncated from "components/Truncated";

export const MenuItemList = styled.ol`
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const MenuItem = styled.li`
  color: var(--color);
  display: flex;
  align-items: center;
  font-size: 0.9em;
  padding: 0 1em;
  height: 3.5em;
  background-color: white;
  position: relative;
  cursor: pointer;
  border-top: 1px solid #d8d8d8;
  border-bottom: 1px solid #d8d8d8;
  margin: -1px 0;
  width: 100%;
  overflow: hidden;
  transition: all 100ms ease-in-out;

  &[disabled] {
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const ParentMenuItem = styled(MenuItem)`
  padding: 0 1em;

  &::after {
    content: "";
    position: absolute;
    background: url(${iconChevron});
    width: 16px;
    height: 16px;
    right: 0.5em;
    opacity: 0.5;
  }

  &[aria-selected="true"] {
    background: #f3f3f3;
    &::after {
      opacity: 1;
    }
    &:hover {
      background: #f3f3f3;
    }
  }
`;

export const SubMenuItem = styled(MenuItem)`
  --color: ${colors.text};
  --colorSecondary: ${colors.textLight};
  --colorTertiary: ${colors.text};

  &[aria-selected="true"] {
    --color: ${colors.white};
    --colorSecondary: ${colors.white};

    background: ${colors.primary};
    border-color: #377090;
    z-index: 2;

    &:hover {
      background: #397596;
    }
  }
`;

export const MenuItemTitles = styled.div`
  flex: 1 1 auto;
  overflow: hidden;
  margin-right: 0.5em;
`;

export const MenuItemTitle = styled.div`
  font-size: 1em;
  margin-bottom: 0.1em;
  color: var(--color);
`;

export const MenuItemSubtitle = styled.div`
  font-size: 0.9em;
  color: var(--colorSecondary);
`;

export const MenuItemType = styled.span`
  font-size: 10px;
  background: #e4e8eb;
  padding: 0.3em 0.7em;
  border-radius: 1em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--colorTertiary);
  flex: 0 1 auto;
  justify-self: flex-end;
`;

const SectionTitle = styled.div`
  background: #f4f5f6;
  font-size: 11px;
  padding: 0.3rem 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: bold;
  color: #666;
  line-height: 1.1;

  &:not(:first-of-type) {
    border-top: 1px solid #e4e8eb;
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid #e4e8eb;
  }
`;

export const Menu = ({ data, onSelected, isSelected, onUnselected }) => (
  <MenuItemList>
    {data
      ? data.map(section => (
          <ParentMenuItem
            key={section.id}
            onClick={() => {
              onUnselected();
              onSelected(section);
            }}
            aria-selected={isSelected(section)}
          >
            {section.displayName}
          </ParentMenuItem>
        ))
      : null}
  </MenuItemList>
);

export const SubMenu = ({
  data,
  onSelected,
  isSelected,
  isDisabled,
  ...otherProps
}) => (
  <MenuItemList>
    {data.map(page =>
      page.answers.map(item => (
        <SubMenuItem
          key={item.id}
          aria-selected={isSelected(item)}
          onClick={() => onSelected(item)}
          disabled={isDisabled && isDisabled(item)}
          {...otherProps}
        >
          <MenuItemTitles>
            <MenuItemTitle>
              <Truncated>{item.displayName}</Truncated>
            </MenuItemTitle>
            <MenuItemSubtitle>
              <Truncated>{page.displayName}</Truncated>
            </MenuItemSubtitle>
          </MenuItemTitles>
          <MenuItemType>{item.type}</MenuItemType>
        </SubMenuItem>
      ))
    )}
  </MenuItemList>
);

export const FlatSectionMenu = ({ data, ...otherProps }) =>
  data.map(section => (
    <div key={section.id}>
      <SectionTitle>{section.displayName}</SectionTitle>
      <SubMenu data={section.pages} {...otherProps} />
    </div>
  ));
