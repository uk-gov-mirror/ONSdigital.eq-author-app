import React from "react";
import PropTypes from "prop-types";
import { flowRight } from "lodash";

import { Query, useMutation } from "react-apollo";

import ALL_USERS from "../graphql/AllUsers.graphql";
import ADD_REMOVE_EDITOR from "../graphql/AddRemoveEditor.graphql";

import Loading from "components/Loading";
import Error from "components/Error";
import UserList from "./UserList";
import UserSearch from "./UserSearch";

import { Section, EditorTitle, Described } from "../styles";

const User = PropTypes.shape({
  picture: PropTypes.string,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
});

const propType = {
  EditorSearch: {
    users: PropTypes.arrayOf(User).isRequired,
  },
  GetUserWrapper: {
    owner: PropTypes.shape(User),
    editors: PropTypes.arrayOf(PropTypes.shape(User)),
  },
};

const EditorSearch = ({ questionnaireId: id, users, owner, editors }) => {
  const [mutateEditors] = useMutation(ADD_REMOVE_EDITOR);

  const removeUser = event => {
    const updatedEditors = editors.filter(user => user.id !== event.id);

    mutateEditors({
      variables: {
        input: { id, editors: updatedEditors.map(editor => editor.id) },
      },
    });
  };

  const addUser = user => {
    const isEditor = editors.some(
      editor => editor.id !== user.id || user.id !== owner.id
    );

    if (!isEditor) {
      const updatedEditors = editors.concat(user);
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
        <UserList editors={editors} owner={owner} onRemove={removeUser} />
      </Section>
    </>
  );
};

const QueryWrapper = Component => {
  const GetUserWrapper = props => (
    <Query query={ALL_USERS}>
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
