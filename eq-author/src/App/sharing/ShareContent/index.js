import React from "react";
import { Field } from "components/Forms";
import { flowRight } from "lodash";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
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

const propType = {
  ToggleLabelComp: {
    text: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
  },
  Share: {
    questionnaire: PropTypes.shape({
      id: PropTypes.string.isRequired,
      isPublic: PropTypes.bool.isRequired,
    }),
  },
  UnWrappedShareContent: {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object, //eslint-disable-line
    data: PropTypes.shape({
      questionnaire: CustomPropTypes.questionnaire,
    }),
    showToast: PropTypes.func.isRequired,
  },
  ShareContent: {
    questionnaireId: PropTypes.string, // Isn't required but is needed
  },
};

const ToggleLabelComp = ({ text, isActive }) => (
  <ToggleLabel isActive={isActive}>{text}</ToggleLabel>
);

const Share = ({ questionnaire, toast }) => {
  const { id, isPublic } = questionnaire;
  console.log(id, isPublic, "what");
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
  };

  return (
    <ShareLayout>
      <PageTitle>Share your questionnaire</PageTitle>
      <PageDescription>
        You can share your questionnaire with anyone who has an account with
        Author.
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
        <InsetText>
          Let anyone with an Author account view your questionnaire. If public
          access is off, only editors
        </InsetText>
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
  const { questionnaire } = data;
  console.log("I got this", questionnaire);
  // Reduces prop load by not spread the props
  // {...props} <--- like that
  return <Share questionnaire={questionnaire} toast={showToast} />;
};

const ToastedUnWrappedShareContent = flowRight(withShowToast)(
  UnWrappedShareContent
);

// Keeping this until I have figure out if withApollo is needed
// ------------------------------------------------------------------
// props is full of apollo stuff and not sure I need to pass it on
// Not entirely sure what withApollo does either

const ShareContent = props => {
  return (
    <Query
      query={GET_QUESTIONNAIRE}
      variables={{
        input: {
          // This isn't actually defined which is super weird
          questionnaireId: props.questionnaireId,
        },
      }}
      fetchPolicy="no-cache"
    >
      {innerprops => <ToastedUnWrappedShareContent {...innerprops} />}
    </Query>
  );
};

ToggleLabelComp.propTypes = propType.ToggleLabelComp;
Share.propTypes = propType.Share;
UnWrappedShareContent.propTypes = propType.UnWrappedShareContent;
ShareContent.propTypes = propType.ShareContent;

// export default withApollo(props => {
//   console.log(props);
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
//       {innerprops => <ToastedUnWrappedShareContent {...innerprops} />}
//     </Query>
//   );
// });
// ------------------------------------------------------------------

export default ShareContent;
