import React from "react";
import styled from "styled-components";


const InputField = styled.input`
    width: 100%;
    height: 40px;
    padding: 0 10px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    background-color: var(--yellow-color1);
    color: var(--black-color);
    font-family: ${(props) => props.fontFamily || "pretendard"};
    &::placeholder {
        color: var(--gray-color3);
    }
    &:focus {
        outline: none;
    }
`;

const Input = ({ placeholder, type = "text", value, onChange, fontFamily, ...rest }) => {
    return (
        <InputField
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        fontFamily={fontFamily}
        {...rest}
        />
    );
};

export default Input;
