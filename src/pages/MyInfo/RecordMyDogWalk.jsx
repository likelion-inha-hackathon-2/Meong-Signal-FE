import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useLocation } from "react-router-dom";
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

// 산책 기록 박스 하나
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

  useEffect(() => {
    const fetchDogInfo = async () => {
      if (!id) {
        console.error("존재하지 않는 아이디!");
        return;
      }
      try {
        const data = await getDogInfo(id);
        setDogInfo(data.dog);
        setWalks(data.walks);
      } catch (error) {
        console.error("Error fetching dog info:", error);
      }
    };

    fetchDogInfo();
  }, [id]);

  return (
    <>
      <Header />
      <WalkRecordBox>
        {dogInfo.name && (
          <WalkTitle>강아지 {dogInfo.name}의 산책 기록</WalkTitle>
        )}
        {walks.map((walk, index) => (
          <WalkInfo key={index}>
            <p>거리: {walk.distance} km</p>
            <p>산책한 사람: {walk.nickname}</p>
            <p>날짜: {walk.date}</p>
          </WalkInfo>
        ))}
      </WalkRecordBox>
      <WalkRecordBox>
        {dogInfo.name && (
          <WalkTitle>
            강아지 {dogInfo.name}의 산책 후기
            <p>아직 만드는 중!!</p>
          </WalkTitle>
        )}
        {walks.map((walk, index) => (
          <WalkInfo key={index}>
            <p>멍: {walk.meong}</p>
            <p>시간: {walk.time} 분</p>
            <p>날짜: {walk.date}</p>
            <p>산책 후기 내용: {walk.evaluator_content}</p>
            <p>평균 별점: {walk.evaluated_star}</p>
          </WalkInfo>
        ))}
      </WalkRecordBox>
      <Footer />
    </>
  );
};

export default RecordMyDogWalk;
