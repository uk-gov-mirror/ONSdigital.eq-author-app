import React from "react";
import PropTypes from "prop-types";

import iconGuestAvatar from "../styles/icons/icon-avatar.svg";

import {
  List,
  ListItem,
  UserContainer,
  UserName,
  UserEmail,
  UserIcon,
  RemoveButton,
  UserOwner,
  Line,
} from "../styles/UserList";

const User = PropTypes.shape({
  picture: PropTypes.string,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
});

const propTypes = {
  UserItem: {
    user: PropTypes.shape({
      isOwner: PropTypes.bool,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      picture: PropTypes.string,
    }),
    onRemove: PropTypes.func.isRequired,
  },
  UserList: {
    editors: PropTypes.arrayOf(User).isRequired,
    owner: User.isRequired,
    onRemove: PropTypes.func.isRequired,
  },
};

const UserItem = ({ user, onRemove }) => {
  const { name, email, isOwner } = user;
  const picture = user.picture || iconGuestAvatar;
  return (
    <ListItem>
      <UserContainer isOwner={isOwner}>
        <UserIcon src={picture} alt="" />

        <UserName>{name}</UserName>
        {!isOwner && (
          <Line>
            <UserEmail>{email}</UserEmail>
          </Line>
        )}

        {isOwner ? (
          <Line>
            <UserOwner>Owner</UserOwner>
          </Line>
        ) : (
          <RemoveButton
            onClick={() => onRemove(user)}
            aria-label="Remove editor"
          />
        )}
      </UserContainer>
    </ListItem>
  );
};

const UserList = ({ editors, owner, onRemove }) => (
  <List>
    {[{ ...owner, isOwner: true }, ...editors].map(user => (
      <UserItem key={user.id} user={user} onRemove={onRemove} />
    ))}
  </List>
);

UserItem.propTypes = propTypes.UserItem;
UserList.propTypes = propTypes.UserList;

export default UserList;
