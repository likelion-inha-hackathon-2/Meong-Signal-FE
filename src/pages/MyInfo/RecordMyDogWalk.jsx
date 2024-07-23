import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { getDogInfo } from "../../apis/getDogInfo";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  font-family: "PretendardR";
`;

const WalkRecordBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid var(--gray-color1);
  border-radius: 8px;
  background-color: var(--yellow-color1);
`;

const WalkTitle = styled.h2`
  font-size: 20px;
  font-family: "PretendardB";
  font-weight: 700;
`;

const WalkInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
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
    <Container>
      <WalkRecordBox>
        {dogInfo.name && (
          <WalkTitle>강아지 {dogInfo.name}의 산책 기록</WalkTitle>
        )}
        {walks.map((walk, index) => (
          <WalkInfo key={index}>
            <p>거리: {walk.distance} km</p>
            <p>날짜: {walk.date}</p>
          </WalkInfo>
        ))}
      </WalkRecordBox>
    </Container>
  );
};

export default RecordMyDogWalk;
