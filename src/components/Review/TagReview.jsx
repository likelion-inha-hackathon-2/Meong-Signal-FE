import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Image from "../Image/Image";

const ReviewCard = styled.div`
  padding: 20px;
  border-radius: 8px;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  font-family: "PretendardM";
  background-color: var(--yellow-color1);
`;

const ReviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Tag = styled.span`
  background-color: var(--white-color);
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0 3px; // 태그 사이 간격
  float: right;
`;

const TagReview = ({ review }) => {
  return (
    <ReviewCard>
      <Image
        src={review.evaluated_user_profile}
        alt={`${review.evaluated_user_name} 프로필`}
      />
      <ReviewContent>
        <h3>{review.evaluated_user_name}</h3>
        <p>{review.content}</p>
        <div>
          {review.tag &&
            review.tag.map((tag, idx) => <Tag key={idx}>#{tag.number}</Tag>)}
        </div>
      </ReviewContent>
    </ReviewCard>
  );
};

TagReview.propTypes = {
  review: PropTypes.shape({
    evaluated_user_profile: PropTypes.string.isRequired,
    evaluated_user_name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    tag: PropTypes.arrayOf(
      PropTypes.shape({
        number: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
};

export default TagReview;
