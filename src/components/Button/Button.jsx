import React from "react";
import styled from "styled-components";


const StyledButton = styled.button`
    width: 100%;
    height: 40px;
    background-color: ${(props) => props.backgroungColor || "var(--yellow-color1)"};   // 기본 버튼 색
    color: var(--white-color);
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-family: ${(props) => props.fontFamily || "pretendard"};
    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.hoverbackgroundColor || "var(--yellow-color2)"}; // hover 버튼 색
    }
`;

const Button = ({ text,backgroungColor, hoverbackgroundColor, fontFamily, onClick, ...rest }) => {
    return <StyledButton 
    backgroungColor={backgroungColor}
    hoverbackgroundColor={hoverbackgroundColor}
    onClick={onClick}
    {...rest}>{text}</StyledButton>;
};

export default Button;
