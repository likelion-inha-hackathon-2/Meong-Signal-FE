import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 3px;
`;

const Label = styled.label`
  display: block;
  width: 90px;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  font-size: 16px;
  color: var(--black-color);
  font-family: ${(props) => props.fontFamily || "pretendardR"};
`;

const InputField = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  background-color: var(--yellow-color1);
  color: var(--black-color);
  font-family: ${(props) => props.fontFamily || "pretendardR"};
  &::placeholder {
    color: var(--gray-color3);
  }
  &:focus {
    outline: none;
  }
`;

const Input = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  fontFamily,
  ...rest
}) => {
  return (
    <InputContainer>
      {label && <Label fontFamily={fontFamily}>{label}</Label>}
      <InputField
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        fontFamily={fontFamily}
        {...rest}
      />
    </InputContainer>
  );
};

// eslint 유효성 검사 추가
Input.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  fontFamily: PropTypes.string,
};

export default Input;
