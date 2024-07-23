import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { getAllDogs } from "../../apis/getAllDogs";
import { getBoringDogs } from "../../apis/getBoringDogs";

const ToggleContainer = styled.div`
  position: absolute;
  left: 14px;
  top: 10px;
  z-index: 99;
  display: flex;
  align-items: center;
  padding: 3px;
  border-radius: 4px;
  background-color: var(--pink-color1);
  cursor: pointer;
`;

const ToggleLabel = styled.span`
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  color: var(--black-color);
  margin-right: 8px;
`;

const ToggleSwitch = styled.div`
  width: 40px;
  height: 20px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.$toggled === "true" ? "#f3bebe" : "var(--white-color)"};
  position: relative;
  transition: background-color 0.3s;

  &:before {
    content: "";
    position: absolute;
    top: 2px;
    left: ${(props) => (props.$toggled === "true" ? "22px" : "2px")};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--pink-color3);
    transition: left 0.3s;
  }
`;

const ToggleButton = ({ onToggle }) => {
  const [toggled, setToggled] = useState(false);

  const handleClick = async () => {
    const newToggled = !toggled;
    setToggled(newToggled);
    const data = newToggled ? await getBoringDogs() : await getAllDogs();
    onToggle(data);
  };

  return (
    <ToggleContainer onClick={handleClick}>
      <ToggleLabel>{toggled ? "심심한 강아지" : "모든 강아지"}</ToggleLabel>
      <ToggleSwitch $toggled={toggled.toString()} />
    </ToggleContainer>
  );
};

ToggleButton.propTypes = {
  onToggle: PropTypes.func.isRequired,
};

export default ToggleButton;
