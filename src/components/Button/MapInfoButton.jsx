import React from "react";
import styled from "styled-components";
import Button from "./Button";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const StyledButton = styled(Button)`
  position: absolute;
  left: 14px;
  top: 40px;
  z-index: 99;
  width: 76px;
  height: 26px;
  padding: 2px;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: -0.132px;
  color: var(--black-color);
  background-color: var(--pink-color1);
  &:hover {
    background-color: var(--pink-color2);
  }
`;

const MapInfoButton = ({ isMapInfo, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isMapInfo) {
      navigate("/map-status");
    } else {
      navigate("/map-info");
    }
    onClick();
  };

  return (
    <StyledButton
      text={isMapInfo ? "산책 현황" : "산책 정보"}
      onClick={handleClick}
    />
  );
};

MapInfoButton.propTypes = {
  isMapInfo: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MapInfoButton;
