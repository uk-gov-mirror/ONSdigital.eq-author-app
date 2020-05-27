import React from "react";
import { flowRight } from "lodash";
import PropTypes from "prop-types";

import { Query, useMutation } from "react-apollo";

import ALL_USERS from "../graphql/AllUsers.graphql";

import Loading from "components/Loading";
import Error from "components/Error";
import UserList from "./UserList";
import UserSearch from "./UserSearch";

import { useQuery } from "@apollo/react-hooks";

import {
  Section,
  EditorTitle,
  SearchInput,
  SearchContainer,
  Described,
} from "../styles";

// ------------------------------------------------
/*

1. Need to remove users 
2. Want to add a toast to say you can't remove users

*/
// ------------------------------------------------

const propType = {
  EditorSearch: {
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
      })
    ).isRequired,
  },
};

const dummyData = [
  {
    name: "Thomas",
    email: "thomesmac@gmail.com",
    id: "1",
  },
  {
    name: "Jenna",
    email: "Jenna@mail.com",
    id: "2",
  },
];

const EditorSearch = ({ users: userList, owner, editors }) => {
  const [editorList, setEditorList] = React.useState(editors);
  const removeUser = event => {
    // needs to catch owner better
    // Will add a toast to show that the
    const updatedUsers = editorList.filter(user => user.id !== event.id);

    console.log("updatedUsers :>> ", updatedUsers);
    setEditorList(updatedUsers);
  };

  const addUser = user => {
    setEditorList(userList => [...userList, user]);
  };
  return (
    <>
      <Section>
        <EditorTitle>Add Editors</EditorTitle>
        <Described>
          Search for someone using their name or email address.
        </Described>
        <SearchContainer>
          <UserSearch users={userList} onUserSelect={addUser} />
        </SearchContainer>
        <UserList editors={editorList} owner={owner} onRemove={removeUser} />
      </Section>
    </>
  );
};

// ------------------------------------------------

const QueryWrapper = Component => {
  const GetUserWrapper = props => (
    <Query query={ALL_USERS} fetchPolicy="no-cache">
      {innerprops => {
        if (innerprops.loading) {
          return <Loading height="38rem">Page loading…</Loading>;
        }
        if (innerprops.error) {
          return <Error>Oops! Something went wrong</Error>;
        }
        return (
          <Component
            users={innerprops.data}
            owner={props.owner}
            editors={props.editors}
          />
        );
      }}
    </Query>
  );
  return GetUserWrapper;
};

const QueryWrapped = flowRight(QueryWrapper)(EditorSearch);

EditorSearch.propTypes = propType.EditorSearch;
export default QueryWrapped;
