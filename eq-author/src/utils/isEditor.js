import { find, get } from "lodash";

const isEditor = (users = [], currentUser, questionnaire) => {
  const sharedWithUser = find(users, {
    name: questionnaire.createdBy.name,
  });

  const currentUserIsOwner = currentUser.name === questionnaire.createdBy.name;

  return Boolean(sharedWithUser) || currentUserIsOwner;
};

export default isEditor;
