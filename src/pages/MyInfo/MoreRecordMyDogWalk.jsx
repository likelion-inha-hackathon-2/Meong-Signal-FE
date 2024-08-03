import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
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
  object-fit: cover;
`;

const DogInfoText = styled.div`
  font-family: "PretendardS";
  line-height: 1.5;
  font-size: 16px;
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
  object-fit: cover;
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
  margin-top: 4px;
`;

const ReviewerReview = styled.div`
  font-size: 12px;
  margin-top: 10px;
`;

const MyReviewContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const MyReviewText = styled.div`
  font-size: 12px;
  margin-right: 10px;
`;

const MyProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const MoreRecordMyDogWalk = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { walkId } = location.state || {};

  const [walkInfo, setWalkInfo] = useState(null);

  // 산책 기록 없을 때 예외처리
  useEffect(() => {
    if (!walkId) {
      alert("조회할 수 없는 산책기록입니다.");
      navigate(-1);
      return;
    }

    const fetchWalkReviewInfo = async () => {
      try {
        const data = await getWalkReviewInfo(walkId);
        setWalkInfo(data);
      } catch (error) {
        console.error("Error fetching walk review info:", error);
      }
    };

    fetchWalkReviewInfo();
  }, [walkId, navigate]);

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
          <MyReviewText>{walkInfo.my_review}</MyReviewText>
          <MyProfileImage
            src={walkInfo.my_profile_image}
            alt="나의 프로필 사진"
          />
        </MyReviewContainer>
      </WalkInfoContainer>
      <Footer />
    </>
  );
};

export default MoreRecordMyDogWalk;
