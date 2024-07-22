import React from "react";
import Button from "./Button";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledMapStatusButton = styled(Button)`
  position: absolute;
  left: 14px;
  top: 40px;
  z-index: 99;
  display: flex;
  flex-direction: row;
  width: 76px;
  height: 26px;
  padding: 2px;
  justify-content: center;
  align-items: center;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px; /* line-height 값 수정 */
  letter-spacing: -0.132px;
  color: var(--black-color);
  background-color: var(--pink-color1);
  &:hover {
    background-color: var(--pink-color2);
  }
`;

const MapStatusButton = ({ onClick }) => {
  return <StyledMapStatusButton text="산책 현황" onClick={onClick} />;
};

MapStatusButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default MapStatusButton;
