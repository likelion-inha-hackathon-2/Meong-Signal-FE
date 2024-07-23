// src/components/Trail/Trail.js

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import flagIcon from "../../assets/icons/icon-Flag.png";
import bookmarkIcon1 from "../../assets/icons/icon-Bookmark1.png";
import bookmarkIcon2 from "../../assets/icons/icon-Bookmark2.png";

const TrailCard = styled.div`
  width: 150px;
  height: 120px;
  padding: 10px;
  margin: 10px;
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const FlagIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const BookmarkIcon = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const Title = styled.h3`
  font-size: 14px;
  margin: 5px 0;
  text-align: center;
  margin-bottom: 15px;
  font-family: "PretendardR";
  font-weight: bold;
`;

const InfoWrapper = styled.div`
  font-size: 10px;
  line-height: 1.5;
  font-family: "PretendardR";
`;

const Trail = ({
  name,
  level,
  distance,
  total_time,
  isBookmarked = false,
  onBookmarkToggle,
}) => {
  const handleBookmarkClick = () => {
    onBookmarkToggle({ name, level, distance, total_time });
  };

  return (
    <TrailCard>
      <IconWrapper>
        <FlagIcon src={flagIcon} alt="Flag" />
        <BookmarkIcon
          src={isBookmarked ? bookmarkIcon2 : bookmarkIcon1}
          alt="Bookmark"
          onClick={handleBookmarkClick}
        />
      </IconWrapper>
      <Title>{name}</Title>
      <InfoWrapper>
        <div>완주 레벨: {level}</div>
        <div>총 거리: {distance}</div>
        <div>완주 시간: {total_time}</div>
      </InfoWrapper>
    </TrailCard>
  );
};

Trail.propTypes = {
  name: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  distance: PropTypes.string.isRequired,
  total_time: PropTypes.string.isRequired,
  isBookmarked: PropTypes.bool,
  onBookmarkToggle: PropTypes.func.isRequired,
};

export default Trail;
