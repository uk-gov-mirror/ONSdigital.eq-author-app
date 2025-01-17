import { useMutation } from "@apollo/react-hooks";
import CREATE_SKIP_CONDITION from "./createSkipCondition.graphql";
import DELETE_SKIP_CONDITION from "./deleteSkipCondition.graphql";
import DELETE_SKIP_CONDITIONS from "./deleteSkipConditions.graphql";
import GET_SKIPPABLE_QUERY from "./fragment.graphql";

const createMutationHook = (mutationQuery, input, refetchParentId) => {
  const [mutationFn] = useMutation(mutationQuery, {
    variables: {
      input,
    },
    refetchQueries: [
      {
        query: GET_SKIPPABLE_QUERY,
        variables: {
          input: {
            id: refetchParentId,
          },
        },
      },
    ],
  });

  return mutationFn;
};

export const useCreateSkipCondition = ({ parentId }) =>
  createMutationHook(CREATE_SKIP_CONDITION, { parentId }, parentId);

export const useDeleteSkipConditions = ({ parentId }) =>
  createMutationHook(DELETE_SKIP_CONDITIONS, { parentId }, parentId);

export const useDeleteSkipCondition = ({ id, parentId }) =>
  createMutationHook(DELETE_SKIP_CONDITION, { id }, parentId);
