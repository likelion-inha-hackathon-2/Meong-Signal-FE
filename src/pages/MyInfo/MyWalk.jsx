import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getWalksRecord } from "../../apis/walk";
import Graph from "../../components/Graph/Graph";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  font-family: "PretendardR";
  width: 350px;
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

// 내 산책기록 조회
const MyWalk = () => {
  const [walkData, setWalkData] = useState({
    total_distance: 0,
    total_kilocalories: 0,
    recent_walks: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const walkDataResponse = await getWalksRecord();
        setWalkData(walkDataResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <Container>로딩 중...</Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <WalkRecordBox>
          <WalkTitle>최근 산책 기록</WalkTitle>
          최근 한달간 {walkData.recent_walks.length} 번의 산책을 하셨습니다.
          <Graph recentWalks={walkData.recent_walks} />
          <p>총 거리: {walkData.total_distance}km</p>
          <p>총 칼로리 소모: {walkData.total_kilocalories}kcal</p>
        </WalkRecordBox>
      </Container>
      <Footer />
    </>
  );
};

export default MyWalk;
