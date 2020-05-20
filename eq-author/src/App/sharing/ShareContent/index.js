import React from "react";
import { Field } from "components/Forms";
import { flowRight } from "lodash";
import { withApollo, Query, useMutation } from "react-apollo";
import GET_QUESTIONNAIRE from "../graphql/GetQuestionnaire.graphql";
import TOGGLE_PUBLIC_MUTATION from "../graphql/TogglePublicMutation.graphql";
import config from "config";

import Loading from "components/Loading";
import Error from "components/Error";
import ToggleSwitch from "components/buttons/ToggleSwitch";

import { withShowToast } from "components/Toasts";
import {
  ShareLayout,
  PageTitle,
  SectionTitle,
  PageDescription,
  PageSection,
  SearchInput,
  InsetText,
  SearchContainer,
  Separator,
  Wrapper,
  ToggleLabel,
  ShareButton,
} from "../styles";

const ToggleLabelComp = ({ text, isActive }) => (
  <ToggleLabel isActive={isActive}>{text}</ToggleLabel>
);

const Share = ({ questionnaire, toast }) => {
  const { id, isPublic } = questionnaire;

  const [pub, setIsPublic] = React.useState(isPublic);

  const [updateIsPublic] = useMutation(TOGGLE_PUBLIC_MUTATION);

  const previewUrl = `${config.REACT_APP_LAUNCH_URL}/${
    (questionnaire || {}).id
  }`;

  const togglePublic = () => {
    setIsPublic(!pub);
    updateIsPublic({
      variables: { input: { id, isPublic: !pub } },
    });
  };

  const handleShareClick = () => {
    const textField = document.createElement("textarea");
    textField.setAttribute("data-test", "share-link");
    textField.innerText = previewUrl;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    toast("Link copied to clipboard");
    // alert("Link copied to clipboard");
  };

  return (
    <ShareLayout>
      <PageTitle>Share your questionnaire</PageTitle>
      <PageDescription>
        You can share your questionnaire with anyone who has an account with
        Author.
        {/* Need to add link here */}
      </PageDescription>
      <ShareButton variant="tertiary" small onClick={handleShareClick}>
        Get shareable link
      </ShareButton>
      <PageSection>
        <Wrapper>
          <SectionTitle>Public access</SectionTitle>
          <Separator>
            <ToggleLabelComp text="Off" isActive={!pub} />

            <ToggleSwitch
              id="public"
              name="public"
              onChange={togglePublic}
              checked={pub}
            />
            <ToggleLabelComp text="On" isActive={pub} />
          </Separator>
        </Wrapper>

        {/* Banner goes here */}
        <InsetText>
          Let anyone with an Author account view your questionnaire. If public
          access is off, only editors
        </InsetText>
        {/* Banner goes here */}
        {/* Public access */}
      </PageSection>
      <PageSection>
        <SectionTitle>Editors</SectionTitle>
        <InsetText>
          Editors can edit questionnaire content, add comments, delete the
          questionnaire and add other editors.
        </InsetText>
      </PageSection>
      <PageSection>
        <SectionTitle>Add Editors</SectionTitle>
        Search for someone using their name or email address.
        <SearchContainer>
          <Field>
            <SearchInput placeholder="Tom is cool" />
            {/* Add button here */}
          </Field>
        </SearchContainer>
      </PageSection>
    </ShareLayout>
  );
};

// ------------------------------------------------
const UnWrappedShareContent = ({ loading, error, data, showToast }) => {
  if (loading) {
    return <Loading height="38rem">Page loading…</Loading>;
  }
  if (error) {
    return <Error>Oops! Something went wrong</Error>;
  }
  console.log(data, "here we go");
  const { questionnaire } = data;

  return <Share questionnaire={questionnaire} toast={showToast} />;
};

const Test = flowRight(withShowToast)(UnWrappedShareContent);
// export default withApollo(props => {
//   return (
//     <Query
//       query={GET_QUESTIONNAIRE}
//       variables={{
//         input: {
//           questionnaireId: props.questionnaireId,
//         },
//       }}
//       fetchPolicy="no-cache"
//     >
//       {innerprops => <UnWrappedShareContent {...innerprops} {...props} />}
//     </Query>
//   );
// });

export default withApollo(props => {
  return (
    <Query
      query={GET_QUESTIONNAIRE}
      variables={{
        input: {
          questionnaireId: props.questionnaireId,
        },
      }}
      fetchPolicy="no-cache"
    >
      {innerprops => <Test {...innerprops} {...props} />}
    </Query>
  );
});
