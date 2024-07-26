import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { getDogInfo } from "../../apis/getDogInfo";

const WalkRecordBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px 10px;
  margin: 20px 0;
  border-radius: 8px;
  background-color: var(--yellow-color1);
  width: 300px;
`;

const WalkTitle = styled.h2`
  font-size: 18px;
  font-family: "PretendardB";
  font-weight: 700;
`;

const WalkInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: "PretendardR";
  background-color: var(--gray-color1);
  border-radius: 4px;
  padding: 10px;
`;

const RecordMyDogWalk = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [dogInfo, setDogInfo] = useState({});
  const [walks, setWalks] = useState([]);
  const navigate = useNavigate();

  const handleReviewClick = (walkId) => {
    navigate(`/review/owner`, { state: { walkId } });
  };

  const handleRecordClick = (walkId) => {
    navigate(`/more-record-my-dog-walk`, { state: { walkId } });
  };

  useEffect(() => {
    const fetchDogInfoAndWalks = async () => {
      if (!id) {
        console.error("존재하지 않는 아이디!");
        return;
      }
      try {
        const data = await getDogInfo(id);
        setDogInfo(data.dog);
        setWalks(data.walks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDogInfoAndWalks();
  }, [id]);

  return (
    <>
      <Header />
      <WalkRecordBox>
        {dogInfo.name && <WalkTitle>{dogInfo.name}의 산책 기록</WalkTitle>}
        {walks.map((walk, index) => (
          <WalkInfo key={index}>
            <p>거리: {walk.distance} km</p>
            <p>산책한 사람: {walk.nickname}</p>
            <p>날짜: {walk.date}</p>
            <button
              onClick={() => handleReviewClick(walk.id)}
              disabled={walk.is_reviewed === 1}
            >
              {walk.is_reviewed === 1 ? "리뷰 작성 완료" : "리뷰 작성하기"}
            </button>
            <button onClick={() => handleRecordClick(walk.id)}>
              산책 기록 보기
            </button>
          </WalkInfo>
        ))}
      </WalkRecordBox>
      <Footer />
    </>
  );
};

export default RecordMyDogWalk;
