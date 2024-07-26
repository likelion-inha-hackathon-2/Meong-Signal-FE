import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Rate from "../Rate/Rate";

const ReviewCard = styled.div`
  display: flex;
  align-items: center;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: auto;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: var(--pink-color1);
  font-family: "PretendardM";
`;

const ReviewContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
`;

const ReviewImage = styled.img`
  margin-right: 10px;
  border-radius: 50%;
  width: 70px;
  height: 70px;
`;

const RateReview = ({ review }) => {
  return (
    <ReviewCard>
      <ReviewImage
        src={review.evaluated_user_profile}
        alt={`${review.evaluated_user_name}`}
      />
      <ReviewContent>
        <h3>{review.evaluated_user_name}</h3>
        <p>{review.content}</p>
        <Rate value={review.rating} readOnly />
      </ReviewContent>
    </ReviewCard>
  );
};

RateReview.propTypes = {
  review: PropTypes.shape({
    evaluated_user_profile: PropTypes.string.isRequired,
    evaluated_user_name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
};

export default RateReview;
