import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Image from "../Image/Image";

const DogInfoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 270px;
  height: 107px;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: var(--yellow-color1);
`;

const DogInfoWrapper = styled.div`
  flex: 1;
  font-family: "PretendardM";
  font-size: 12px;
  font-style: normal;
  line-height: 150%; /* 18px */
  letter-spacing: -0.132px;
`;

const DogStatus = styled.div`
  // 상태 변경 추가 필요
`;

const DogInfo = ({ name, gender, age, introduction, status, image }) => {
  return (
    <DogInfoContainer>
      <Image src={image} alt={`${name}`} />
      <DogInfoWrapper>
        <div>이름: {name}</div>
        <div>나이: {age}</div>
        <div> 성별: {gender === "M" ? "남" : "여"}</div>
        <div> 소개: {introduction}</div>
        <DogStatus status={status}>
          상태: {status === "R" ? "쉬는 중" : "산책 중"}
        </DogStatus>
      </DogInfoWrapper>
    </DogInfoContainer>
  );
};

// eslint
DogInfo.propTypes = {
  name: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  introduction: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default DogInfo;
