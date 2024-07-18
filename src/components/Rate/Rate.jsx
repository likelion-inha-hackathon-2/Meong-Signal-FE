import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import yellowStar from "../../assets/icons/icon-yellowStar.png";
import grayStar from "../../assets/icons/icon-grayStar.png";

const StyledRateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledRate = styled.div`
  display: flex;
  flex-direction: row;

  .star {
    width: 24px;
    height: 24px;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
  }

  // 회색 별점(안 칠해진 별)
  .star.gray {
    background-image: url(${grayStar});
  }

  // 노란색 별점(칠해진 별)
  .star.yellow {
    background-image: url(${yellowStar});
  }
`;

const Rate = ({ value = 1, onChange = null }) => {
  const [rating, setRating] = useState(value);

  const handleClick = (index) => {
    const newRating = index + 1;
    setRating(newRating);
    if (onChange) {
      onChange(newRating);
    }
  };

  return (
    <StyledRateContainer>
      <StyledRate>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={`star ${index < rating ? "yellow" : "gray"}`}
              onClick={() => handleClick(index)}
            />
          ))}
      </StyledRate>
    </StyledRateContainer>
  );
};

Rate.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};

export default Rate;
