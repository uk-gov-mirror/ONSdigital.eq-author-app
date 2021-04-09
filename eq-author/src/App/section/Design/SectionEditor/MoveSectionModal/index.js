import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import MoveModal from "components/MoveModal";
import PositionModal from "components/PositionModal";

const propTypes = {
  section: CustomPropTypes.section.isRequired,
  questionnaire: CustomPropTypes.questionnaire.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMoveSection: PropTypes.func.isRequired,
};
const MoveSectionModal = (props) => {
  const { section, questionnaire, onMoveSection } = props;
  const handleOnMove = ({ position }) => {
    onMoveSection({
      from: {
        id: section.id,
        position: section.position,
      },
      to: {
        id: section.id,
        position: position,
      },
    });
  };

  return (
    <MoveModal title={"Move section"} {...props}>
      <PositionModal
        options={questionnaire.sections}
        selected={section}
        onMove={handleOnMove}
      />
    </MoveModal>
  );
};

MoveSectionModal.propTypes = propTypes;

export default MoveSectionModal;
