import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchReceivedReviews } from "../../apis/review";
import TagReview from "../../components/Review/TagReview";
import StarReview from "../../components/Review/RateReview";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Image from "../../components/Image/Image";
import IconMailBox from "../../assets/icons/review/icon-review-r.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: "PretendardR";
`;

const ReviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
`;

const SectionTitle = styled.h2`
  font-family: "PretendardS";
  margin: 10px 0;
`;

const TitleWrapper = styled.div`
  display: flex;
  padding: 10px;
  font-family: "PretendardB";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
`;

const ReceivedReview = () => {
  const [userReviews, setUserReviews] = useState([]);
  const [walkingReviews, setWalkingReviews] = useState([]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const data = await fetchReceivedReviews();
        setUserReviews(data.user_review);
        setWalkingReviews(data.walking_review);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    getReviews();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <ReviewSection>
          <TitleWrapper>
            <Image src={IconMailBox} width="32px" height="32px" />
            <SectionTitle>내가 받은 후기</SectionTitle>
          </TitleWrapper>
          <SectionTitle>산책 후기</SectionTitle>
          {walkingReviews.map((review, index) => (
            <TagReview key={index} review={review} />
          ))}
        </ReviewSection>
        <ReviewSection>
          <SectionTitle>사용자 후기</SectionTitle>
          {userReviews.map((review, index) => (
            <StarReview key={index} review={review} />
          ))}
        </ReviewSection>
      </Container>
      <Footer />
    </>
  );
};

export default ReceivedReview;
