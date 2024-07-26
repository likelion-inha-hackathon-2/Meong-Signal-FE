import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { getWalkReviewInfo } from "../../apis/walk";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const WalkInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background-color: var(--gray-color1);
  width: 350px;
  margin: auto;
  font-family: "PretendardR";
`;

const DogInfoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const DogImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 20px;
`;

const DogInfoText = styled.div`
  font-family: "PretendardS";
  line-height: 1.5;
  font-size: 16px;
`;

const WalkImage = styled.img`
  width: 250px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 2px solid var(--gray-color2);
`;

const ReviewerInfoContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
`;

const ReviewerImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
`;

const ReviewerDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReviewerName = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const ReviewerRating = styled.div`
  font-size: 12px;
  color: gray;
`;

const ReviewerReview = styled.div`
  font-size: 12px;
  margin-top: 10px;
`;

const MyReviewContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row-reverse;
`;

const MyReviewText = styled.div`
  justify-content: center;
  align-items: center;
  font-size: 12px;
`;

const MyProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 20px;
`;

const MoreRecordMyDogWalk = () => {
  const location = useLocation();
  const { walkId } = location.state || {};
  const [walkInfo, setWalkInfo] = useState(null);

  useEffect(() => {
    const fetchWalkReviewInfo = async () => {
      try {
        const data = await getWalkReviewInfo(walkId);
        setWalkInfo(data);
      } catch (error) {
        console.error("Error fetching walk review info:", error);
      }
    };

    fetchWalkReviewInfo();
  }, [walkId]);

  if (!walkInfo) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <WalkInfoContainer>
        <DogInfoContainer>
          <DogImage src={walkInfo.dog_image} alt="강아지 사진" />
          <DogInfoText>
            {walkInfo.dog_name}이(가) {walkInfo.reviewer_nickname}님과 총{" "}
            {walkInfo.total_distance}km를 산책했어요.. 멍멍!
          </DogInfoText>
        </DogInfoContainer>
        <WalkImage src={walkInfo.image} alt="산책 이미지" />
        <ReviewerInfoContainer>
          <ReviewerImage
            src={walkInfo.reviewer_profile_image}
            alt="리뷰어 프로필 사진"
          />
          <ReviewerDetails>
            <ReviewerName>{walkInfo.reviewer_nickname}</ReviewerName>
            <ReviewerRating>
              평균 별점: {walkInfo.reviewer_average_rating}
            </ReviewerRating>
            <ReviewerReview>{walkInfo.received_review}</ReviewerReview>
          </ReviewerDetails>
        </ReviewerInfoContainer>
        <MyReviewContainer>
          <MyProfileImage
            src={walkInfo.my_profile_image}
            alt="나의 프로필 사진"
          />
          <MyReviewText>{walkInfo.my_review}</MyReviewText>
        </MyReviewContainer>
      </WalkInfoContainer>
      <Footer />
    </>
  );
};

MoreRecordMyDogWalk.propTypes = {
  walkId: PropTypes.number.isRequired,
};

export default MoreRecordMyDogWalk;
