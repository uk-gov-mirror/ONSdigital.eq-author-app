import { graphql } from "react-apollo";
import updatePageMutation from "graphql/updatePage.graphql";
import pageFragment from "graphql/fragments/page.graphql";
import { filter } from "graphql-anywhere";

let updateQuestionCount = 0;

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateQuestionPage: page => {
    const data = filter(pageFragment, page);

    const currentUpdateQuestionCount = updateQuestionCount++;

    return mutate({
      variables: { 
        input: data
      },
      optimisticResponse: {
        updateQuestionPage: {
          ...page,
          ...data,
          __typename: "QuestionPage",
        },
      },
      update: (proxy, { data: {updateQuestionPage}}) => {
        // Update the local cache with the last called mutation to avoid race condition caused by
        // second mutation returning before the previous
        if (currentUpdateQuestionCount === updateQuestionCount - 1) {
          console.log({currentUpdateQuestionCount, updateQuestionCount, updateQuestionPage}, {
            id: `${updateQuestionPage.__typename}${updateQuestionPage.id}`,
            fragment: pageFragment,
            data: updateQuestionPage
          });
          proxy.writeFragment( {
            id: `${updateQuestionPage.__typename}${updateQuestionPage.id}`,
            fragment: pageFragment,
            data: updateQuestionPage
          });     

        }
      }
    });
  },
});

export default graphql(updatePageMutation, {
  props: mapMutateToProps,
});
