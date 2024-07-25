import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Map from "../../components/Map/Map";
import { getDogInfo } from "../../apis/getDogInfo";
import { getDistance } from "../../apis/getDistance";
import { getCoordinates } from "../../apis/geolocation";
//import SelectRoute from "../../components/Walk/SelectRoute";

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

const StopButton = styled.button`
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

const MapStatusWalking = () => {
  const { dogId } = useParams();
  const navigate = useNavigate();
  const [dogInfo, setDogInfo] = useState({});
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.4482020408321,
    longitude: 126.651415033662,
  });
  const [initialLocation, setInitialLocation] = useState(currentLocation);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);

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
        setInitialLocation(coordinates);
        setCurrentLocation(coordinates);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCurrentLocation = {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        };
        setCurrentLocation(newCurrentLocation);
        const dist = getDistance(
          initialLocation.latitude,
          initialLocation.longitude,
          newCurrentLocation.latitude,
          newCurrentLocation.longitude
        );
        setDistance((prev) => prev + dist);
        setCalories((prev) => prev + dist * 0.04);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [initialLocation]);

  const handleEndWalk = () => {
    navigate(`/map-status/complete/${dogId}`); // 산책 완료 페이지로 이동 (라우팅 설정 해야할듯)
  };

  return (
    <>
      <Header />
      <Container>
        <DogInfo>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DogImage src={dogInfo.image} alt={dogInfo.name} />
            <DogName>{dogInfo.name}와 산책중입니다!</DogName>
          </div>
          <div>
            <InfoButton>정보 보기</InfoButton>
            <InfoButton>보호자와 채팅하기</InfoButton>
          </div>
        </DogInfo>
        <Map
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
          width="100%"
          height="300px"
        />
        <StopButton onClick={handleEndWalk}>산책 종료</StopButton>
        <Stat>지금까지 {distance.toFixed(1)} km를 이동하셨어요!</Stat>
        <Stat>소비한 칼로리는 {calories.toFixed(0)} kcal에요!</Stat>
      </Container>
      <Footer />
    </>
  );
};

export default MapStatusWalking;
