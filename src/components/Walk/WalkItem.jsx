import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const WalkItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--yellow-color1);
  border-radius: 8px;
  padding: 10px;
`;

const WalkImage = styled.img`
  width: 130px;
  height: auto;
  object-fit: cover;
`;

const WalkInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
`;

const WalkText = styled.p`
  margin: 2px;
  font-family: "PretendardR";
  font-size: 16px;
`;

const WalkItem = ({ image, distance, time, date }) => {
  return (
    <WalkItemContainer>
      <WalkImage src={image} alt="산책 이미지" />
      <WalkInfo>
        <WalkText>거리: {distance} km</WalkText>
        <WalkText>시간: {time} 분</WalkText>
        <WalkText>날짜: {date}</WalkText>
      </WalkInfo>
    </WalkItemContainer>
  );
};

WalkItem.propTypes = {
  image: PropTypes.string.isRequired,
  distance: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
};

export default WalkItem;
