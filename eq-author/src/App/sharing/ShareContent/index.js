import React from "react";
import { Field } from "components/Forms";
import { withApollo, Query, useMutation } from "react-apollo";
import GET_QUESTIONNAIRE from "../graphql/GetQuestionnaire.graphql";
import TOGGLE_PUBLIC_MUTATION from "../graphql/TogglePublicMutation.graphql";

import Loading from "components/Loading";
import Error from "components/Error";
import ToggleSwitch from "components/buttons/ToggleSwitch";

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

const Share = ({ questionnaire }) => {
  const { id, isPublic } = questionnaire;

  const [pub, setIsPublic] = React.useState(isPublic);

  const [updateIsPublic] = useMutation(TOGGLE_PUBLIC_MUTATION);

  const togglePublic = () => {
    setIsPublic(!pub);
    updateIsPublic({
      variables: { input: { id, isPublic: !pub } },
    });
  };

  return (
    <ShareLayout>
      <PageTitle>Share your questionnaire</PageTitle>
      <PageDescription>
        You can share your questionnaire with anyone who has an account with
        Author.
        {/* Need to add link here */}
      </PageDescription>
      <ShareButton>Get shareable link</ShareButton>
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
const UnWrappedShareContent = ({ loading, error, data }) => {
  if (loading) {
    return <Loading height="38rem">Page loading…</Loading>;
  }
  if (error) {
    return <Error>Oops! Something went wrong</Error>;
  }
  console.log(data, "here we go");
  const { questionnaire } = data;

  return <Share questionnaire={questionnaire} />;
};

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
      {innerprops => <UnWrappedShareContent {...innerprops} {...props} />}
    </Query>
  );
});
