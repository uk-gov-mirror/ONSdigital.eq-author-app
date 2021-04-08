import React, { useState } from "react";

import PropTypes from "prop-types";

import { Toolbar, Buttons } from "App/page/Design/EditorToolbar";

import ShortCodeEditor from "components/ShortCodeEditor";
import DuplicateButton from "components/buttons/DuplicateButton";
import MoveButton from "components/buttons/MovePageButton";
import DeleteButton from "components/buttons/IconButtonDelete";
import DeleteConfirmDialog from "components/DeleteConfirmDialog";
import MovePageModal from "App/page/Design/MovePageModal";

import iconFolder from "assets/icon-dialog-folder.svg";

const deleteAlertText = {
  folder:
    "All questions in this folder will also be removed. This may affect piping and routing rules elsewhere.",
};

const icons = {
  folder: iconFolder,
};

const EditorToolbar = ({
  shortCode,
  title,
  pageType,
  shortCodeOnUpdate,
  onMove,
  onDuplicate,
  onDelete,
  disableMove,
  disableDuplicate,
  disableDelete,
  data,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMoveFolderModal, setMoveFolderModal] = useState(false);
  return (
    <>
      <Toolbar>
        <ShortCodeEditor shortCode={shortCode} onUpdate={shortCodeOnUpdate} />
        <Buttons>
          <MoveButton
            data-test="btn-move-folder"
            disabled={disableMove}
            onClick={() => setMoveFolderModal(true)}
          />
          <DuplicateButton
            data-test="btn-duplicate-folder"
            disabled={disableDuplicate}
            onClick={onDuplicate}
          />
          <DeleteButton
            disabled={disableDelete}
            onClick={() => setShowDeleteModal(true)}
          />
        </Buttons>
      </Toolbar>

      <DeleteConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => {
          setShowDeleteModal(false);
          onDelete();
        }}
        title={shortCode || title || `Untitled ${pageType}`}
        alertText={deleteAlertText[pageType]}
        icon={icons[pageType]}
        data-test={`delete-${pageType}-modal`}
      />
      <MovePageModal
        isOpen={showMoveFolderModal}
        onClose={() => setMoveFolderModal(false)}
        onMovePage={onMove}
        sectionId={data.folder.section.id}
        page={data.folder}
        folder
      />
    </>
  );
};

EditorToolbar.propTypes = {
  shortCode: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  pageType: PropTypes.string.isRequired,
  shortCodeOnUpdate: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disableMove: PropTypes.bool,
  disableDuplicate: PropTypes.bool,
  disableDelete: PropTypes.bool,
};

export default EditorToolbar;
