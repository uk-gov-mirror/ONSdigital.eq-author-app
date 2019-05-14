import React from "react";
import Modal from "components/modals/Modal";
import styled from "styled-components";
import DialogHeader from "components/Dialog/DialogHeader";
import { Message, Heading } from "components/Dialog/DialogMessage";

import ToggleSwitch from "components/buttons/ToggleSwitch";
import { Label, Field } from "components/Forms";

import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";

import UserList from "./UserList";
import UserSearch from "./UserSearch";

import iconShare from "./icon-share.svg";

import users from "./users";
import { colors } from "constants/theme";

const LabelDescription = styled.span`
  font-weight: normal;
  font-size: 0.9em;
`;

const InlineField = styled(Field)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 1em;
  height: 100%;
`;

const CenteredHeading = styled(Heading)`
  text-align: center;
  margin-bottom: 1rem;
`;

const StyledModal = styled(Modal)`
  .Modal {
    width: 38em;
  }
`;

const ShareButton = styled(Button)`
  font-weight: normal;
  font-size: 0.9rem;
  line-height: 1.2;
  display: flex;
  align-items: center;
  padding: 0.1em;
  margin: 0.5em auto 0;

  &::after {
    content: "";
    background: url(${iconShare}) no-repeat center;
    display: inline-block;
    width: 1rem;
    height: 1rem;
    margin-left: 0.2em;
  }

  &:hover {
    background: transparent;
    color: ${colors.secondary};
  }
`;

const ActionButtonGroup = styled(ButtonGroup)`
  position: relative;
`;

const SharingModal = ({
  isOpen,
  onClose,
  onSubmit,
  displayToast,
  users: editors,
  addUser,
  removeUser,
  togglePublic,
  isPublic,
  owner,
}) => (
  <StyledModal isOpen={isOpen} onClose={onClose}>
    <DialogHeader>
      <Message>
        <CenteredHeading>
          <div>Questionnaire sharing</div>
          <ShareButton variant="tertiary" small onClick={displayToast}>
            Get shareable link
          </ShareButton>
        </CenteredHeading>
      </Message>
    </DialogHeader>

    <div>
      <InlineField>
        <Label inline htmlFor="public">
          Public
          <br />
          <LabelDescription>
            When enabled, this questionnaire is publicly accessible to all users
            in read-only mode. If turned off, then editors will still have
            access.
          </LabelDescription>
        </Label>
        <ToggleSwitch
          id="public"
          name="public"
          onChange={togglePublic}
          checked={isPublic}
        />
      </InlineField>

      <InlineField>
        <Label inline>
          Editors
          <br />
          <LabelDescription>
            Editors have full access to the questionnaire, including editing
            content, adding other editors and deleting the questionnaire.
          </LabelDescription>
        </Label>
      </InlineField>

      <UserList users={editors} owner={owner} onRemove={removeUser} />
      <UserSearch
        users={users}
        existingUsers={editors}
        onUserSelect={addUser}
      />
    </div>

    <ActionButtonGroup horizontal align="right">
      <Button variant="primary" onClick={onClose}>
        Done
      </Button>
    </ActionButtonGroup>
  </StyledModal>
);

export default SharingModal;
