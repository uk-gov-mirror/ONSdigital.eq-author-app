import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, radius } from "constants/theme";

import Truncated from "components/Truncated";
import ItemSelectModal from "components/ItemSelectModal";
import ItemSelect from "components/ItemSelectModal/ItemSelect";
import Icon from "assets/icon-select.svg";

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

export const InnerModal = ({
  id,
  title,
  isOpen,
  onClick,
  onClose,
  onConfirm,
  onChange,
  children,
  selected,
  displayName,
}) => {
  return (
    <>
      <Label htmlFor={id}>{title}</Label>
      <Trigger id={id} onClick={onClick}>
        <Truncated>{displayName || "Select"}</Truncated>
      </Trigger>
      <ItemSelectModal
        title={title}
        data-test={`${title.toLowerCase()}-select-modal`}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <ItemSelect
          data-test="section-item-select"
          name={title.toLowerCase()}
          value={selected?.id || selected}
          onChange={({ value }) => onChange(value)}
        >
          {children}
        </ItemSelect>
      </ItemSelectModal>
    </>
  );
};

InnerModal.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  onChange: PropTypes.func,
  children: PropTypes.node,
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      id: PropTypes.string,
      displayName: PropTypes.string,
      position: PropTypes.number,
    }),
  ]).isRequired,
  displayName: PropTypes.string,
};
