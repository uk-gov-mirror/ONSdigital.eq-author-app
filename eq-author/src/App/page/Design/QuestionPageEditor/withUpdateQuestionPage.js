import { graphql } from "react-apollo";
import updatePageMutation from "graphql/updatePage.graphql";
import pageFragment from "graphql/fragments/page.graphql";
import { filter } from "graphql-anywhere";

let updateQuestionCount = 0;
let callStack = {};

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateQuestionPage: page => {
    const data = filter(pageFragment, page);

    const currentUpdateQuestionCount = updateQuestionCount++;
    const key = `call${currentUpdateQuestionCount}`;

    callStack[key] = mutate({
      variables: {
        input: data,
      },
      optimisticResponse: {
        updateQuestionPage: {
          ...page,
          ...data,
          __typename: "QuestionPage",
        },
      },

      update: (proxy, { data: { updateQuestionPage } }) => {
        // Update the local cache with the last called mutation to avoid race condition caused by
        // second mutation returning before the previous

        // Remove this entry from callStack
        delete callStack[key];

        const callStackList = Object.entries(callStack);

        if (callStackList.length) {
          Promise.all(callStackList).then(() => {
            if (currentUpdateQuestionCount === updateQuestionCount - 1) {
              // Just write last called to local cache

              proxy.writeFragment({
                id: `${updateQuestionPage.__typename}${updateQuestionPage.id}`,
                fragment: pageFragment,
                data: updateQuestionPage,
              });
            }
          });
        }
      },
    });

    return callStack[key];
  },
});

export default graphql(updatePageMutation, {
  props: mapMutateToProps,
});
