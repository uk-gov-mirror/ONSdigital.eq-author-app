import React from "react";
import { flowRight } from "lodash";
import PropTypes from "prop-types";

import { Query, useMutation } from "react-apollo";

import ALL_USERS from "../graphql/AllUsers.graphql";

import Loading from "components/Loading";
import Error from "components/Error";

import { useQuery } from "@apollo/react-hooks";

import {
  Section,
  EditorTitle,
  SearchInput,
  SearchContainer,
  AddButton,
  Described,
} from "../styles";

// ------------------------------------------------
/*
I want to be able to wrap the sharing page with the three necessary extras

Succeeded in creating a double wrapped query with HOC's
problem is I think it's redundant

ON WEDNESDAY
Going to rewrite to use the useQuery hook and batch it

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

const EditorSearch = ({ users }) => {
  console.log(users);
  return (
    <>
      <Section>
        <EditorTitle>Add Editors</EditorTitle>
        <Described>
          Search for someone using their name or email address.
        </Described>
        <SearchContainer>
          <SearchInput />
          <AddButton
            type="submit"
            variant="primary"
            data-test="editor-add-button"
          >
            Add
          </AddButton>
        </SearchContainer>
      </Section>
    </>
  );
};

// ------------------------------------------------

const QueryWrapper = Component => {
  const GetQuestionnaireWrapper = () => (
    <Query query={ALL_USERS} fetchPolicy="no-cache">
      {innerprops => {
        if (innerprops.loading) {
          return <Loading height="38rem">Page loading…</Loading>;
        }
        if (innerprops.error) {
          return <Error>Oops! Something went wrong</Error>;
        }
        return <Component users={innerprops.data} />;
      }}
    </Query>
  );
  return GetQuestionnaireWrapper;
};

const QueryWrapped = flowRight(QueryWrapper)(EditorSearch);

EditorSearch.propTypes = propType.EditorSearch;
export default QueryWrapped;
