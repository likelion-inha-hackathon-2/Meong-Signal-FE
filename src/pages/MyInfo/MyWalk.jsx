import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getWalksRecord } from "../../apis/walk";
import { fetchMyDogs } from "../../apis/myDogs";
import Graph from "../../components/Graph/Graph";
import DogInfoWalkRecord from "../../components/Dog/DogInfoWalkRecord";
import { useNavigate } from "react-router-dom";

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

const MyWalk = () => {
  const [walkData, setWalkData] = useState({
    total_distance: 0,
    total_kilocalories: 0,
    recent_walks: [],
  });

  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walkDataResponse, dogsDataResponse] = await Promise.all([
          getWalksRecord(),
          fetchMyDogs(),
        ]);
        setWalkData(walkDataResponse);
        setDogs(dogsDataResponse.dogs);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDogClick = (id) => {
    navigate("/walk-dog-record", { state: { id } });
  };

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
          <p>총 거리: {walkData.total_distance} km</p>
          <p>총 칼로리 소모: {walkData.total_kilocalories} kcal</p>
        </WalkRecordBox>
        <WalkRecordBox>
          <WalkTitle>내 산책 기록 모아보기</WalkTitle>
          {dogs.map((dog) => (
            <DogInfoWalkRecord
              key={dog.id}
              id={dog.id}
              name={dog.name}
              gender={dog.gender}
              age={dog.age}
              introduction={dog.introduction}
              image={dog.image}
              onClick={() => handleDogClick(dog.id)}
            />
          ))}
        </WalkRecordBox>
      </Container>
      <Footer />
    </>
  );
};

export default MyWalk;
