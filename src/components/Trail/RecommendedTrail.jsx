import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Trail from "./Trail";

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  margin-bottom: 20px;
`;

const RecommendedTrail = ({ trails, handleBookmarkToggle, isBookmarked }) => {
  return (
    <>
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
