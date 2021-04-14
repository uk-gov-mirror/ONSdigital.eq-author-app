import React, { useState, useEffect, useRef, Fragment } from "react";
import PropTypes from "prop-types";
import { uniqueId } from "lodash";
import styled from "styled-components";
import ItemSelect, { Option } from "components/ItemSelectModal/ItemSelect";
import ItemSelectModal from "components/ItemSelectModal";
import Truncated from "components/Truncated";
import Icon from "assets/icon-select.svg";

import { colors, radius } from "constants/theme";

const Label = styled.label`
  display: block;
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 0.25rem;
  margin-top: 1.25rem;
`;

const Trigger = styled.button.attrs({ type: "button" })`
  width: 100%;
  font-size: 1em;
  padding: 0.5rem;
  padding-right: 2em;
  background: ${colors.white} url("${Icon}") no-repeat right center;
  border: solid 1px ${colors.borders};
  text-align: left;
  border-radius: ${radius};
  color: ${colors.black};

  &:focus {
    box-shadow: 0 0 0 3px ${colors.tertiary}, inset 0 0 0 1px ${colors.primary};
    outline: none;
  }
`;

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

  const handleChange = ({ value }) => {
    const option = orderedOptions[value];
    const count =
      option?.__typename === "Folder" && value - position >= 0
        ? orderedOptions.filter(({ parentId }) => parentId === option.id).length
        : 0;
    setOption({
      position: parseInt(value, 10) + count,
      item: option,
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
    <Fragment data-test={`${title.toLowerCase()}-position-modal`}>
      <Label htmlFor={positionButtonId}>{title}</Label>
      <Trigger id={positionButtonId} onClick={() => setIsOpen(true)}>
        <Truncated>{selected.displayName || "Select"}</Truncated>
      </Trigger>
      <ItemSelectModal
        title={title}
        data-test={`${title.toLowerCase()}-select-modal`}
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      >
        <ItemSelect
          data-test="section-item-select"
          name={title.toLowerCase()}
          value={String(position)}
          onChange={onChange || handleChange}
        >
          {orderedOptions.map(({ displayName, parentEnabled }, i) => (
            <Indent
              data-test="options"
              key={i}
              value={String(i)}
              indent={parentEnabled ? parentEnabled.toString() : undefined}
            >
              {displayName}
            </Indent>
          ))}
        </ItemSelect>
      </ItemSelectModal>
    </Fragment>
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
  selected: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    position: PropTypes.number,
  }).isRequired,
  onMove: PropTypes.func,
  onChange: PropTypes.func,
};

export default PositionModal;
