import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Rate from "../../components/Rate/Rate";
import { submitReview } from "../../apis/reviewsApi.";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const StyledTextArea = styled.textarea`
  width: 90%;
  height: 100px;
  padding: 8px;
  font-size: 16px;
  border-radius: 13px;
  border: 1px solid #ddd;
  resize: none;
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  color: black;
  background-color: #ffe8ad;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #ffe8ad;
  }
`;

const UserReview = ({ userName, walkId }) => {
  const [rating, setRating] = useState(1);
  const [content, setContent] = useState("");

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async () => {
    const review = {
      rating,
      content,
      walk_id: walkId 
    };

    console.log("Review to submit:", review);

    try {
      const response = await submitReview(review);
      console.log("Review submitted successfully!", response);
      
    } catch (error) {
      console.error("Failed to submit review", error);
      
    }
  };

  return (
    <StyledContainer>
      <h2>"{userName}"님은 어떠셨나요?</h2>
      <Rate value={rating} onChange={handleRatingChange} />
      <StyledTextArea
        value={content}
        onChange={handleContentChange}
        placeholder="리뷰를 작성해 주세요..."
      />
      <StyledButton onClick={handleSubmit}>리뷰 저장하기</StyledButton>
    </StyledContainer>
  );
};

UserReview.propTypes = {
  userName: PropTypes.string.isRequired,
  walkId: PropTypes.number.isRequired
};

export default UserReview;
