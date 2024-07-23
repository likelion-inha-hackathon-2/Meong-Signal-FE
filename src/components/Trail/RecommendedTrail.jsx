import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Trail from "./Trail";

const ListContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
  font-family: "PretendardM";
`;

const RecommendedTrail = ({ trails, handleBookmarkToggle, isBookmarked }) => {
  return (
    <>
      <SectionTitle>산책로 추천</SectionTitle>
      <ListContainer>
        {trails.map((trail, index) => (
          <Trail
            key={index}
            name={trail.name}
            level={trail.level}
            distance={trail.distance}
            total_time={trail.total_time}
            isBookmarked={isBookmarked(trail)}
            onBookmarkToggle={() => handleBookmarkToggle(trail)}
          />
        ))}
      </ListContainer>
    </>
  );
};

RecommendedTrail.propTypes = {
  trails: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      distance: PropTypes.string.isRequired,
      total_time: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleBookmarkToggle: PropTypes.func.isRequired,
  isBookmarked: PropTypes.func.isRequired,
};

export default RecommendedTrail;
