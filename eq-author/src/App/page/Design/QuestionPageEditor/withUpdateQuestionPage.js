import { graphql } from "react-apollo";
import updatePageMutation from "graphql/updatePage.graphql";
import pageFragment from "graphql/fragments/page.graphql";
import { filter } from "graphql-anywhere";

let updateQuestionCount = 0;
let lastCalledResult;

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateQuestionPage: page => {
    const data = filter(pageFragment, page);

    const currentUpdateQuestionCount = updateQuestionCount++;

    lastCalledResult = null;

    return mutate({
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

        if (currentUpdateQuestionCount === updateQuestionCount - 1) {
          lastCalledResult = updateQuestionPage;
        } else {
          // Write results of last called mutation to local cache if it has already been returned
          if (lastCalledResult) {
            proxy.writeFragment({
              id: `${updateQuestionPage.__typename}${updateQuestionPage.id}`,
              fragment: pageFragment,
              data: lastCalledResult,
            });
          }
        }
      },
    });
  },
});

export default graphql(updatePageMutation, {
  props: mapMutateToProps,
});
