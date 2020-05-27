import React from "react";
import reactStringReplace from "react-string-replace";
import PropTypes from "prop-types";
import styled from "styled-components";
import Downshift from "downshift";
import gql from "graphql-tag";

// import { Query, useMutation } from "react-apollo";

import { colors } from "constants/theme";

import { Field, Label } from "components/Forms";

import { UncontrolledInput } from "components/Forms/Input";

import Button from "components/buttons/Button";

const maxListHeight = 6;

// ------------------------------------------------------------------------------

/*

Tomorrow I need to tidy everything up
I need to read up about the downshift component - So I can remove the contents of the input
Add the extra graphql mutations to handle updating the editors list
Finish adding the tests

Is my method wrong?

*/

// ------------------------------------------------------------------------------

const SearchInput = styled(UncontrolledInput)`
  padding: 0.5em;
  font-size: 1em;
  width: 100%;
  border: 1px solid ${colors.borders};
`;

const SearchResults = styled.ul`
  list-style: none;
  margin: -1px 0 0;
  padding: 0;
  border: 1px solid ${colors.bordersLight};
  max-height: ${maxListHeight}em;
  overflow: scroll;
  position: absolute;
  width: 100%;
  z-index: 2;
  background: white;

  &:empty {
    display: none;
  }
`;

const SearchResult = styled.li`
  display: flex;
  align-items: center;
  font-size: 0.85em;
  padding: 0.3em;
  height: 2em;
  cursor: pointer;
  background-color: ${props =>
    props.selected ? colors.lighterGrey : "transparent"};

  &:not(:last-of-type) {
    border-bottom: 1px solid ${colors.bordersLight};
  }
`;

const SearchResultName = styled.span`
  font-weight: bold;
  margin-right: 0.5em;
`;

const SearchResultEmail = styled.span`
  font-weight: normal;
`;

const Highlight = styled.span`
  text-decoration: underline;
`;

const highlighSearchTerm = (...args) =>
  reactStringReplace(...args, (match, i) => (
    <Highlight key={i}>{match}</Highlight>
  ));

// const dummyData = [
//   {
//     name: "Thomas",
//     email: "thomas@mail.com",
//     id: "1",
//   },
//   {
//     name: "Jenna",
//     email: "Jenna@mail.com",
//     id: "2",
//   },
// ];

const UserSearch = ({ users, onUserSelect }) => {
  const [user, setUser] = React.useState("");
  //   const [user, setUser] = React.useState({ name: null, email: null, id: null });
  const addUser = target => {
    console.log("Hello world!", target);
    setUser(target);
  };
  //   const handleClick = event => {
  //     onUserSelect(event);
  //   };
  return (
    <>
      <Downshift
        initialIsOpen={false}
        onSelect={addUser}
        // onSelect={onUserSelect}
        itemToString={() => ""}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => (
          <div>
            <Field>
              <Label {...getLabelProps()}>Add editors</Label>
              <SearchInput
                {...getInputProps()}
                placeholder="search people by name or email address"
                // Can't do on change as it overwrites the getInputProps
                // onChange={value => setUser(value)}
                value={user.name}
              />
              <SearchResults {...getMenuProps()}>
                {isOpen &&
                  users
                    .filter(user => {
                      if (!inputValue) {
                        return false;
                      }
                      const value = inputValue.toLowerCase();
                      return (
                        (user.name || "").toLowerCase().includes(value) ||
                        user.email.toLowerCase().includes(value)
                      );
                    })
                    .map((user, index) => (
                      <SearchResult
                        key={user.id}
                        {...getItemProps({
                          index,
                          item: user,
                          selected: highlightedIndex === index,
                        })}
                      >
                        <SearchResultName>
                          {highlighSearchTerm(user.name, inputValue)}
                        </SearchResultName>
                        <SearchResultEmail>
                          {"<"}
                          {highlighSearchTerm(user.email, inputValue)}
                          {">"}
                        </SearchResultEmail>
                      </SearchResult>
                    ))}
              </SearchResults>
              <Button
                type="submit"
                variant="primary"
                data-test="editor-add-button"
                onClick={() => onUserSelect(user)}
              >
                Add
              </Button>
            </Field>
          </div>
        )}
      </Downshift>
    </>
  );
};

UserSearch.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      email: PropTypes.string.isRequired,
    })
  ).isRequired,
  onUserSelect: PropTypes.func.isRequired,
};

export default UserSearch;
