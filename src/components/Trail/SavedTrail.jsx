import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Trail from "./Trail";

const ListContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 2px;
`;

const SavedTrail = ({ trails, handleBookmarkToggle }) => {
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
            isBookmarked={true}
            onBookmarkToggle={() => handleBookmarkToggle(trail)}
          />
        ))}
      </ListContainer>
    </>
  );
};

SavedTrail.propTypes = {
  trails: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      distance: PropTypes.string.isRequired,
      total_time: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleBookmarkToggle: PropTypes.func.isRequired,
};

export default SavedTrail;
