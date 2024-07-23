import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import tagsData from "../Tag/tagsData.json";

const ReviewCard = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  height: 107px;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: var(--yellow-color1);
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

const Tag = styled.span`
  background-color: var(--white-color);
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0 3px;
  display: inline-flex;
  align-items: center;
  font-size: 0.9em;
  gap: 5px;
`;

const TagReview = ({ review }) => {
  return (
    <ReviewCard>
      <ReviewImage
        src={review.evaluated_user_profile}
        alt={`${review.evaluated_user_name}님의 프로필 사진`}
      />
      <ReviewContent>
        <strong>{review.evaluated_user_name}</strong>
        <p>{review.content}</p>
        <div>
          {review.tags &&
            review.tags.map((tag, idx) => {
              const tagInfo = tagsData.find((t) => t.id === tag.number);
              return (
                <Tag key={idx}>
                  #{tagInfo.emoji}
                  {tagInfo.label}
                </Tag>
              );
            })}
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
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        number: PropTypes.number.isRequired,
      }),
    ),
  }).isRequired,
};

export default TagReview;
