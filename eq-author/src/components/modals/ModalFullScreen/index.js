import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { colors } from "constants/theme";
import Modal, { CloseButton } from "components/modals/Modal";
import ScrollPane from "components/ScrollPane";

const StyledModal = styled(Modal)`
  .Overlay {
    background-color: transparent;
  }
  .Modal {
    width: 100%;
    height: 100%;
    top: 0;
    background: ${colors.lighterGrey};
    padding: 0;
  }
`;

const ModalFullScreen = props => {
  const { children, onClose, isOpen, ...otherProps } = props;
  return (
    <StyledModal
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton={false}
      {...otherProps}
    >
      <ScrollPane>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ScrollPane>
    </StyledModal>
  );
};

ModalFullScreen.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default ModalFullScreen;
