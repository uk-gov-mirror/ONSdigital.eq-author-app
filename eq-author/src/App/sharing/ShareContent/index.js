import React from "react";
import { flowRight } from "lodash";
import PropTypes from "prop-types";
import { Query, useMutation } from "react-apollo";
import GET_QUESTIONNAIRE from "../graphql/GetQuestionnaire.graphql";
import TOGGLE_PUBLIC_MUTATION from "../graphql/TogglePublicMutation.graphql";
import config from "config";

import EditorSearch from "./EditorSearch";
import Loading from "components/Loading";
import Error from "components/Error";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import { InformationPanel } from "components/Panel";

import { withShowToast } from "components/Toasts";
import {
  Layout,
  PageTitle,
  Description,
  Section,
  SectionTitle,
  Separator,
  Wrapper,
  PublicLabel,
  ShareButton,
} from "../styles";

const propTypes = {
  TogglePublicLabel: {
    text: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
  },
  Sharing: {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      isPublic: PropTypes.bool.isRequired,
    }),
    toast: PropTypes.func.isRequired,
  },
};

const TogglePublicLabel = ({ text, isActive }) => (
  <PublicLabel isActive={isActive}>{text}</PublicLabel>
);

const Sharing = ({ data, showToast }) => {
  const { id, isPublic, createdBy, editors } = data.questionnaire;
  const [pub, setIsPublic] = React.useState(isPublic);

  const [updateIsPublic] = useMutation(TOGGLE_PUBLIC_MUTATION);

  const previewUrl = `${config.REACT_APP_LAUNCH_URL}/${
    (data.questionnaire || {}).id
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
    showToast("Link copied to clipboard");
  };

  return (
    <Layout>
      <PageTitle>Share your questionnaire</PageTitle>
      <Description>
        You can share your questionnaire with anyone who has an account with
        Author.
      </Description>
      <ShareButton variant="tertiary" small onClick={handleShareClick}>
        Get shareable link
      </ShareButton>
      <Section>
        <Wrapper>
          <SectionTitle>Public access</SectionTitle>
          <Separator>
            <TogglePublicLabel text="Off" isActive={!pub} />

            <ToggleSwitch
              id="public"
              name="public"
              onChange={togglePublic}
              checked={pub}
            />
            <TogglePublicLabel text="On" isActive={pub} />
          </Separator>
        </Wrapper>
        <InformationPanel>
          Let anyone with an Author account view your questionnaire. If public
          access is off, only editors
        </InformationPanel>
      </Section>
      <Section>
        <SectionTitle>Editors</SectionTitle>
        <InformationPanel>
          Editors can edit questionnaire content, add comments, delete the
          questionnaire and add other editors.
        </InformationPanel>
      </Section>
      <EditorSearch questionnaireId={id} owner={createdBy} editors={editors} />
    </Layout>
  );
};

// ------------------------------------------------

const QueryWrapper = Component => {
  const GetQuestionnaireWrapper = props => (
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
      {innerprops => {
        if (innerprops.loading) {
          return <Loading height="38rem">Page loading…</Loading>;
        }
        if (innerprops.error) {
          return <Error>Oops! Something went wrong</Error>;
        }
        return <Component data={innerprops.data} {...props} />;
      }}
    </Query>
  );
  return GetQuestionnaireWrapper;
};

const ToastedUnwrappedSharing = flowRight(withShowToast, QueryWrapper)(Sharing);

TogglePublicLabel.propTypes = propTypes.ToggleLabelComp;
Sharing.propTypes = propTypes.Share;

export default ToastedUnwrappedSharing;
