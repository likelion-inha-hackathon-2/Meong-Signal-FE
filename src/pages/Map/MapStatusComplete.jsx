import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Map2 from "../../components/Map/Map2";
import { getDogInfo } from "../../apis/getDogInfo";
import { getDistance } from "../../apis/getDistance";
import { getCoordinates } from "../../apis/geolocation";

const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const DogInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const DogImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const DogName = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const InfoButton = styled.button`
  padding: 5px 10px;
  background-color: #dddddd;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
`;

const CompleteButton = styled.button`
  padding: 10px 20px;
  background-color: #ff9900;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
`;

const Stat = styled.div`
  margin-top: 20px;
  font-size: 18px;
`;

const MapStatusComplete = () => {
  const { dogId } = useParams();
  const navigate = useNavigate();
  const [dogInfo, setDogInfo] = useState({});
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.4482020408321,
    longitude: 126.651415033662,
  });
  const [initialLocation, setInitialLocation] = useState(null);
  const [finalDistance, setFinalDistance] = useState(0);
  const [finalCalories, setFinalCalories] = useState(0);

  useEffect(() => {
    const fetchDogInfo = async () => {
      try {
        const data = await getDogInfo(dogId);
        setDogInfo(data.dog);
        setInitialLocation({
          latitude: data.dog.latitude,
          longitude: data.dog.longitude,
        });
      } catch (error) {
        console.error("Error fetching dog info:", error);
      }
    };

    fetchDogInfo();
  }, [dogId]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const coordinates = await getCoordinates();
        setCurrentLocation(coordinates);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, []);

  useEffect(() => {
    const distance = parseFloat(localStorage.getItem('walkDistance')) || 0;
    const calories = parseFloat(localStorage.getItem('walkCalories')) || 0;
    setFinalDistance(distance);
    setFinalCalories(calories);
  }, []);

  const handleReview = () => {
    navigate(`/reviews/${dogId}`); // DogReview.jsx로 이동
  };

  return (
    <>
      <Header />
      <Container>
        <DogInfo>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DogImage src={dogInfo.image} alt={dogInfo.name} />
            <DogName>{dogInfo.name}와의 산책이 종료되었습니다.</DogName>
          </div>
          <div>
            <InfoButton>정보 보기</InfoButton>
            <InfoButton>보호자와 채팅하기</InfoButton>
          </div>
        </DogInfo>
        <Map2
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
          width="100%"
          height="300px"
          dogId={dogId} // dogId 전달
        />
        <CompleteButton onClick={handleReview}>후기 남기러 가기</CompleteButton>
        <Stat>이번 산책에서 총 이동한 거리: {finalDistance.toFixed(1)} km</Stat>
        <Stat>이번 산책에서 소모한 칼로리: {finalCalories.toFixed(0)} kcal</Stat>
      </Container>
      <Footer />
    </>
  );
};

export default MapStatusComplete;
