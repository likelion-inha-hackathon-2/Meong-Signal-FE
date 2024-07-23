import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getWalksRecord } from "../../apis/walks/getWalksRecord";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const WalkInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid var(--gray-color1);
  border-radius: 8px;
  background-color: var(--yellow-color1);
`;

const WalkItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid var(--gray-color2);
`;

const WalkTitle = styled.h2`
  font-size: 20px;
  font-family: "PretendardB";
  font-weight: 700;
`;

const WalkData = styled.div`
  font-size: 16px;
  font-family: "PretendardR";
`;

const MyWalk = () => {
  const [walkData, setWalkData] = useState({
    total_distance: 0,
    total_kilocalories: 0,
    recent_walks: [],
  });

  useEffect(() => {
    const fetchWalkData = async () => {
      try {
        const data = await getWalksRecord();
        setWalkData(data);
      } catch (error) {
        console.error("Error fetching walk data:", error);
      }
    };

    fetchWalkData();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <WalkInfo>
          <WalkTitle>산책 기록</WalkTitle>
          <WalkData>총 거리: {walkData.total_distance} km</WalkData>
          <WalkData>
            총 칼로리 소모: {walkData.total_kilocalories} kcal
          </WalkData>
        </WalkInfo>
        <WalkInfo>
          <WalkTitle>최근 산책 기록</WalkTitle>
          {walkData.recent_walks.length > 0 ? (
            walkData.recent_walks.map((walk, index) => (
              <WalkItem key={index}>
                <div>날짜: {new Date(walk.date).toLocaleDateString()}</div>
                <div>거리: {walk.distance} km</div>
                <div>칼로리: {walk.kilocalories} kcal</div>
              </WalkItem>
            ))
          ) : (
            <WalkData>최근 산책 기록이 없습니다.</WalkData>
          )}
        </WalkInfo>
      </Container>
      <Footer />
    </>
  );
};

export default MyWalk;
