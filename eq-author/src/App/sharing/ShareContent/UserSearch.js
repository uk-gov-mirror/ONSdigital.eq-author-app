import React, { useState } from "react";
import reactStringReplace from "react-string-replace";
import PropTypes from "prop-types";
import Downshift from "downshift";

import { Field, Label } from "components/Forms";
import Button from "components/buttons/Button";

import {
  SearchInput,
  SearchResults,
  SearchResult,
  SearchResultName,
  SearchResultEmail,
  Highlight,
} from "../styles/UserSearch";

const propTypes = {
  UserSearch: {
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string,
        email: PropTypes.string.isRequired,
      })
    ).isRequired,
    onUserSelect: PropTypes.func.isRequired,
  },
};

const highlighSearchTerm = (...args) =>
  reactStringReplace(...args, (match, i) => (
    <Highlight key={i}>{match}</Highlight>
  ));

const UserSearch = ({ users, onUserSelect }) => {
  const [user, setUser] = useState(null);

  const addUser = target => {
    setUser(target);
  };

  return (
    <>
      <Downshift
        initialIsOpen={false}
        onSelect={addUser}
        itemToString={user => (user ? user.name : "")}
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

UserSearch.propTypes = propTypes.UserSearch;

export default UserSearch;
