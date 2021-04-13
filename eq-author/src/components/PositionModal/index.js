import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { uniqueId } from "lodash";
import styled from "styled-components";
import { InnerModal } from "./InnerModal";
import { Option } from "components/ItemSelectModal/ItemSelect";

const Indent = styled(Option)`
  margin-left: ${({ indent }) => (indent ? 1 : 0)}em;
`;

const PositionModal = ({ title, options, onMove, selected, onChange }) => {
  const positionButtonId = uniqueId("PositionModal");
  const [isOpen, setIsOpen] = useState(false);

  const previousIndex = options.findIndex(({ id }) => id === selected?.id);
  const previousPosition = useRef(previousIndex > -1 ? previousIndex : 0);

  const [{ position, item }, setOption] = useState({
    position: previousPosition.current,
    item: options[previousPosition.current],
  });

  useEffect(() => {
    // resets the position of the selected item when changing sections
    const previousIndex = options.findIndex(({ id }) => id === selected?.id);
    previousPosition.current = previousIndex > -1 ? previousIndex : 0;
    setOption((prev) => ({ ...prev, position: previousPosition.current }));
  }, [options, selected]);

  const orderedOptions = options.filter(({ id }) => id !== selected?.id);
  selected.parentEnabled = item?.parentEnabled;
  orderedOptions.splice(position, 0, selected);

  const handleClose = () => {
    setIsOpen(false);
    setOption({
      position: previousPosition.current,
      item: orderedOptions[previousPosition.current],
    });
  };

  const handleChange = (value) => {
    const count =
      orderedOptions[value]?.__typename === "Folder" && value - position >= 0
        ? orderedOptions.filter(
            ({ parentId }) => parentId === orderedOptions[value].id
          ).length
        : 0;
    setOption({
      position: parseInt(value, 10) + count,
      item: orderedOptions[value],
    });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    // item is the element in the modal you just clicked
    const { parentId = null } = item;

    let positionCalculation;

    if (parentId) {
      // get pages in target folder + selected item
      positionCalculation = orderedOptions
        .filter(
          ({ parentId: itemId, id }) =>
            parentId === itemId || id === selected.id
        )
        .findIndex(({ id }) => id === selected.id);
    } else {
      // remove all nested pages
      positionCalculation = orderedOptions
        .filter(({ parentId }) => !parentId)
        .findIndex(({ id }) => id === selected.id);
    }

    if (onMove) {
      onMove({
        ...item,
        folderId: parentId,
        position: positionCalculation,
      });
    }

    setIsOpen(false);
  };

  return (
    <div data-test="position-modal">
      <InnerModal
        id={positionButtonId}
        title={title}
        isOpen={isOpen}
        onClick={() => setIsOpen(true)}
        onClose={handleClose}
        onConfirm={handleConfirm}
        onChange={onChange || handleChange}
        selected={String(position)}
        displayName={selected.displayName}
      >
        {orderedOptions.map(({ displayName, parentEnabled }, i) => (
          <Indent
            data-test={`option-${i}`}
            key={i}
            value={String(i)}
            indent={parentEnabled ? parentEnabled.toString() : undefined}
          >
            {displayName}
          </Indent>
        ))}
      </InnerModal>
    </div>
  );
};

PositionModal.propTypes = {
  title: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      folderId: PropTypes.string,
      parentEnabled: PropTypes.bool,
    })
  ).isRequired,
  onMove: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    position: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.string,
};

export default PositionModal;
