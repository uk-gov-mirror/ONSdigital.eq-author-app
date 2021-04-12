import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import MoveModal from "components/MoveModal";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import PositionModal from "components/PositionModal";
// import { find, uniqueId } from "lodash";

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
  entity: PropTypes.string.isRequired,
};

const entityData = {
  Folder: {
    options: (folders) =>
      folders.map((item) => (!item.enabled ? item.pages[0] : item)),
    move: ({ selected, sectionId, selectedSectionId, folderId, position }) => ({
      from: {
        id: selected.id,
        sectionId,
        position: selected.position,
      },
      to: {
        id: selected.id,
        selectedSectionId,
        folderId,
        position: position,
      },
    }),
  },
  Page: {
    options: (folders) => buildPageList(folders),
    move: ({ selected, sectionId, selectedSectionId, folderId, position }) => ({
      from: {
        id: selected.id,
        sectionId,
        position: selected.position,
      },
      to: {
        id: selected.id,
        sectionId: selectedSectionId,
        folderId,
        position: position,
      },
    }),
  },
};

const MoveEntityModal = ({
  sectionId,
  selected,
  isOpen,
  onClose,
  onMove,
  entity,
}) => {
  const { questionnaire } = useQuestionnaire();
  const { options, move } = entityData[entity];

  const [isSectionSelectOpen, setIsSectionSelectOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(sectionId);

  // const sectionButtonId = uniqueId("MovePageModal");

  const handleMove = (result) => {
    const { position, folderId } = result;
    onMove(
      move({ selected, sectionId, selectedSectionId, folderId, position })
    );
  };

  const selectedSection =
    questionnaire &&
    questionnaire.sections.find(({ id }) => id === selectedSectionId);

  return useMemo(
    () =>
      !questionnaire ? null : (
        <MoveModal
          title={entity === "Page" ? "Move question" : "Move folder"}
          isOpen={isOpen}
          onClose={onClose}
        >
          <PositionModal
            data-test={"section-position-modal"}
            title={"Section"}
            options={questionnaire.sections}
            onMove={() => setIsSectionSelectOpen(false)}
            selected={selectedSection}
            onChange={(value) =>
              setSelectedSectionId(questionnaire.sections[value].id)
            }
          />
          <PositionModal
            data-test={`${entity.toLowerCase()}-position-modal`}
            title={entity}
            options={
              selectedSection?.folders.length &&
              options(selectedSection.folders)
            }
            onMove={handleMove}
            selected={selected}
          />
        </MoveModal>
      ),
    [selectedSection, questionnaire, selected, isOpen, isSectionSelectOpen]
  );
};

MoveEntityModal.propTypes = propTypes;

export default MoveEntityModal;
