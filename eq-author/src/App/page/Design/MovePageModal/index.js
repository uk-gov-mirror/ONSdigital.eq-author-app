import React, { useMemo, useState } from "react";
import MoveModal from "components/MoveModal";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import PositionModal from "components/PositionModal";
import { find, uniqueId } from "lodash";

import { useQuestionnaire } from "components/QuestionnaireContext";

export const buildPageList = (folders) => {
  const optionList = [];
  folders.forEach((folder) => {
    const { id, enabled, pages } = folder;
    if (enabled) {
      optionList.push({
        ...folder,
        parentEnabled: false,
      });
    }
    pages.forEach((page) => {
      optionList.push({
        ...page,
        parentId: enabled ? id : null,
        parentEnabled: enabled,
      });
    });
  });
  return optionList;
};

const propTypes = {
  sectionId: PropTypes.string.isRequired,
  page: CustomPropTypes.page,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMovePage: PropTypes.func.isRequired,
};

const MovePageModal = ({ sectionId, page, isOpen, onClose, onMovePage }) => {
  const { questionnaire } = useQuestionnaire();
  const [isSectionSelectOpen, setIsSectionSelectOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(sectionId);

  const sectionButtonId = uniqueId("MovePageModal");

  const handleCloseSectionSelect = () => {
    setIsSectionSelectOpen(false);
  };

  const handlePageMove = (result) => {
    const { position, folderId } = result;
    onMovePage({
      from: {
        id: page.id,
        sectionId,
        position: page.position,
      },
      to: {
        id: page.id,
        sectionId: selectedSectionId,
        folderId,
        position: position,
      },
    });
  };

  const selectedSection = useMemo(
    () =>
      questionnaire && find(questionnaire.sections, { id: selectedSectionId }),
    [questionnaire, selectedSectionId]
  );

  return useMemo(
    () =>
      !questionnaire ? null : (
        <MoveModal title={"Move question"} isOpen={isOpen} onClose={onClose}>
          <PositionModal
            data-test={"section-position-modal"}
            title={"Section"}
            options={questionnaire.sections}
            onMove={handleCloseSectionSelect}
            selected={selectedSection}
            onChange={(value) =>
              setSelectedSectionId(questionnaire.sections[value].id)
            }
          />
          <PositionModal
            data-test={"page-position-modal"}
            title={"Page"}
            options={
              selectedSection?.folders.length &&
              buildPageList(selectedSection.folders)
            }
            onMove={handlePageMove}
            selected={page}
          />
        </MoveModal>
      ),
    [selectedSection, questionnaire, page, isOpen, isSectionSelectOpen]
  );
};

MovePageModal.propTypes = propTypes;

export default MovePageModal;
