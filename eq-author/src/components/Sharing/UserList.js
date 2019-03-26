import React from "react";
import styled from "styled-components";
import { colors } from "constants/theme";
import iconGuestAvatar from "App/UserProfile/icon-guest-avatar.svg";
import iconClose from "./icon-close.svg";
import { sortBy, capitalize } from "lodash";

import ScrollPane from "components/ScrollPane";

const List = styled.ul`
  padding: 0;
  margin: 0 0 1em;
  list-style: none;
  color: ${colors.text};
  max-height: 10em;
`;

const ListItem = styled.li`
  margin: 0 0 0.1em;
  padding: 0.3em 0;
  display: flex;
  align-items: center;
  position: relative;
  color: #666;
  /* border-bottom: 1px solid ${colors.bordersLight}; */
`;

const UserName = styled.div`
  font-weight: bold;
  font-size: 0.9em;
`;

const UserEmail = styled.div`
  font-size: 0.9em;
  margin-left: 0.5em;
  opacity: 0.7;
`;

const UserIcon = styled.img`
  margin-right: 0.25em;
  height: 1.1em;
`;

const RemoveButton = styled.button`
  appearance: none;
  width: 1.5em;
  height: 1.5em;
  background: url(${iconClose}) no-repeat center;
  background-size: 100%;
  position: absolute;
  right: 0.3em;
  border: none;
  padding: 0;
  font-size: 1rem;
  opacity: 0.5;
  &:focus {
    outline: 2px solid ${colors.tertiary};
  }
`;

const UserOwner = styled.span`
  position: absolute;
  right: 0.5em;
  font-size: 0.9em;
  font-weight: bold;
  opacity: 0.7;
`;

const UserList = ({ users, onRemove, owner }) => (
  <ScrollPane css={{ marginBottom: "1em" }}>
    <List>
      <ListItem key={owner.id}>
        {owner.picture ? (
          <UserIcon src={owner.picture} alt="" />
        ) : (
          <UserIcon src={iconGuestAvatar} alt="" />
        )}
        <UserName>{owner.name}</UserName>

        <UserOwner>owner</UserOwner>
      </ListItem>
      {sortBy(users, ({ owner }) => !owner).map(user => (
        <ListItem key={user.id}>
          {user.picture ? (
            <UserIcon src={user.picture} alt="" />
          ) : (
            <UserIcon src={iconGuestAvatar} alt="" />
          )}

          <UserName>{user.name}</UserName>
          <UserEmail>{user.email}</UserEmail>

          <RemoveButton onClick={() => onRemove(user)} />
        </ListItem>
      ))}
    </List>
  </ScrollPane>
);

export default UserList;
