import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Map from "../../components/Map/Map";
import { getDogInfo } from "../../apis/getDogInfo";
import { getCoordinates } from "../../apis/geolocation";

const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const DogInfo = styled.div`
  display: flex;
  align-items: center;
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

const StartButton = styled.button`
  padding: 10px 20px;
  background-color: #ff9900;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
`;

const MapStatusStart = () => {
  const { dogId } = useParams();
  const navigate = useNavigate();
  const [dogInfo, setDogInfo] = useState({});
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.4482020408321,
    longitude: 126.651415033662,
  });

  useEffect(() => {
    const fetchDogInfo = async () => {
      try {
        const data = await getDogInfo(dogId);
        setDogInfo(data.dog);
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

  const handleStartWalk = () => {
    navigate(`/map-status/walking/${dogId}`);  // 산책중 페이지로 이동 (라우팅 설정 필요)
  };

  return (
    <>
      <Header />
      <Container>
        <DogInfo>
          <DogImage src={dogInfo.image} alt={dogInfo.name} />
          <DogName>{dogInfo.name}와 산책을 시작합니다!</DogName>
        </DogInfo>
        <Map
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
          width="100%"
          height="300px"
        />
        <StartButton onClick={handleStartWalk}>산책 시작</StartButton>
      </Container>
      <Footer />
    </>
  );
};

export default MapStatusStart;
