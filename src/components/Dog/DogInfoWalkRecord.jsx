import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const DogInfoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  height: 107px;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: var(--yellow-color2);
  cursor: pointer;
`;

const DogImage = styled.img`
  margin-right: 10px;
  border-radius: 50%;
  pointer-events: none;
`;

const DogInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  font-family: "PretendardM";
  font-size: 12px;
  font-style: normal;
  line-height: 150%;
  letter-spacing: -0.132px;
`;

const DogInfoWalkRecord = ({
  name,
  gender,
  age,
  introduction,
  image,
  onClick,
}) => (
  <DogInfoContainer onClick={onClick}>
    <DogImage src={image} alt="강아지 사진" width="80px" height="80px" />
    <DogInfoWrapper>
      <div>이름: {name}</div>
      <div>나이: {age}</div>
      <div>성별: {gender === "M" ? "남" : "여"}</div>
      <div>소개: {introduction}</div>
    </DogInfoWrapper>
  </DogInfoContainer>
);

DogInfoWalkRecord.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  introduction: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DogInfoWalkRecord;
