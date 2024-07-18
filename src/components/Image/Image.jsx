import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledButton = styled.button`
  width: 100%;
  height: 40px;
  background-color: ${(props) =>
    props.backgroundColor || "var(--yellow-color1)"}; // 기본 버튼 색
  color: var(--white-color);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-family: ${(props) => props.fontFamily || "pretendard"};
  cursor: pointer;
  &:hover {
    background-color: ${(props) =>
      props.hoverBackgroundColor || "var(--yellow-color2)"}; // hover 버튼 색
  }
`;

const Button = ({
  text,
  backgroundColor,
  hoverBackgroundColor,
  onClick,
  ...rest
}) => {
  return (
    <StyledButton
      backgroundColor={backgroundColor}
      hoverBackgroundColor={hoverBackgroundColor}
      onClick={onClick}
      {...rest}
    >
      {text}
    </StyledButton>
  );
};

// eslint 유효성 검사 추가
Button.propTypes = {
  text: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  hoverBackgroundColor: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
