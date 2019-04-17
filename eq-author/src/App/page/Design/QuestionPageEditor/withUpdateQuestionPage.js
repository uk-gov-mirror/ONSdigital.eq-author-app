import { graphql } from "react-apollo";
import updatePageMutation from "graphql/updatePage.graphql";
import pageFragment from "graphql/fragments/page.graphql";
import { filter } from "graphql-anywhere";

let updateQuestionCount = 0;

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateQuestionPage: page => {
    const data = filter(pageFragment, page);

    const currentUpdateQuestionCount = updateQuestionCount++;
    let latestUpdateQuestionPage;

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
      /*
      update: (proxy, { data: {updateQuestionPage}}) => {
        // Update the local cache with the last called mutation to avoid race condition caused by
        // second mutation returning before the previous
        console.log("update", {updateQuestionPage, currentUpdateQuestionCount, updateQuestionCount});

        if (currentUpdateQuestionCount === updateQuestionCount - 1) {
          latestUpdateQuestionPage = updateQuestionPage;
        } else {
          if (latestUpdateQuestionPage) {
            console.log("latest", {latestUpdateQuestionPage, updateQuestionCount, updateQuestionPage}, {
              id: `${latestUpdateQuestionPage.__typename}${latestUpdateQuestionPage.id}`,
              fragment: pageFragment,
              data: latestUpdateQuestionPage
            });
            proxy.writeFragment( {
              id: `${latestUpdateQuestionPage.__typename}${latestUpdateQuestionPage.id}`,
              fragment: pageFragment,
              data: latestUpdateQuestionPage
            });

            latestUpdateQuestionPage = null;
          }
        }
      }
      */
    }).then(res => {
      return false;
    });
  },
});

export default graphql(updatePageMutation, {
  props: mapMutateToProps,
});
