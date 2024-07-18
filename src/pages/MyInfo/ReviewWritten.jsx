import React, { useEffect, useState } from "react";
import authApi from "../../apis/authApi";
import styled from "styled-components";
import TagReview from "../../components/Review/TagReview";
import StarReview from "../../components/Review/RateReview";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SentReview = () => {
  const [userReviews, setUserReviews] = useState([]);
  const [walkingReviews, setWalkingReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await authApi.get("/reviews/written");
        setUserReviews(response.data.user_review);
        setWalkingReviews(response.data.walking_review);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <>
      <Header />
      <Container>
        {userReviews.map((review, index) => (
          <StarReview key={index} review={review} />
        ))}
        {walkingReviews.map((review, index) => (
          <TagReview key={index} review={review} />
        ))}
      </Container>
      <Footer />
    </>
  );
};

export default SentReview;
