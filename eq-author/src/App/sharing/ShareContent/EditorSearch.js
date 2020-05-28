import React, { useState } from "react";
import { flowRight } from "lodash";
import PropTypes from "prop-types";

import { Query, useMutation } from "react-apollo";

import ALL_USERS from "../graphql/AllUsers.graphql";
import ADD_REMOVE_EDITOR from "../graphql/AddRemoveEditor.graphql";

import Loading from "components/Loading";
import Error from "components/Error";
import UserList from "./UserList";
import UserSearch from "./UserSearch";

import { Section, EditorTitle, Described } from "../styles";

// ------------------------------------------------
/*

1. Tidy everything up and correct the styling
2. Look into replacing the questionnaire call with a local one



*/
const dummyData = [
  {
    name: "Thomas McAuliffe",
    email: "tom@mail.com",
    id: "1",
  },
  {
    name: "Thomas McAuliffe",
    email: "tom@mail.com",
    id: "12",
  },
  {
    name: "Thomas McAuliffe",
    email: "tom@mail.com",
    id: "13",
  },
  {
    name: "ThomasThomasThomasThomasThomasThomas",
    email: "tom@mail.com tom@mail.com tom@mail.com",
    id: "2",
  },
];
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
  GetUserWrapper: {
    owner: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
    editors: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
      })
    ),
  },
};

const EditorSearch = ({ questionnaireId: id, users, owner, editors }) => {
  const [editorList, setEditorList] = useState(editors);

  const [mutateEditors] = useMutation(ADD_REMOVE_EDITOR);

  const removeUser = event => {
    const updatedEditors = editorList.filter(user => user.id !== event.id);

    setEditorList(updatedEditors);

    mutateEditors({
      variables: {
        input: { id, editors: updatedEditors.map(editor => editor.id) },
      },
    });
  };

  const addUser = user => {
    const isEditor = editorList.some(
      editor => editor.id !== user.id || user.id !== owner.id
    );

    if (!isEditor) {
      const updatedEditors = editorList.concat(user);
      setEditorList(updatedEditors);
      mutateEditors({
        variables: {
          input: { id, editors: updatedEditors.map(editor => editor.id) },
        },
      });
    }
  };

  return (
    <>
      <Section>
        <EditorTitle>Add Editors</EditorTitle>
        <Described>
          Search for someone using their name or email address.
        </Described>
        <UserSearch users={users} onUserSelect={addUser} />
        {/* <UserList editors={editorList} owner={owner} onRemove={removeUser} /> */}
        <UserList editors={dummyData} owner={owner} onRemove={removeUser} />
      </Section>
    </>
  );
};

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
            users={innerprops.data.users}
            owner={props.owner}
            editors={props.editors}
            questionnaireId={props.questionnaireId}
          />
        );
      }}
    </Query>
  );

  GetUserWrapper.propTypes = propType.GetUserWrapper;

  return GetUserWrapper;
};

const QueryWrapped = flowRight(QueryWrapper)(EditorSearch);

EditorSearch.propTypes = propType.EditorSearch;

export default QueryWrapped;
