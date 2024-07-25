import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Map from "../../components/Map/Map";
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

  const handleReview = () => {
    navigate(`/reviews/${dogId}`); // DogReview.jsx 로 이동해야 할거 같은데 아직 안만들어져서,,, 임의로
  };

  return (
    <>
      <Header />
      <Container>
        <DogInfo>
          <DogImage src={dogInfo.image} alt={dogInfo.name} />
          <DogName>{dogInfo.name}와의 산책이 종료되었습니다.</DogName>
        </DogInfo>
        <Map
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
          width="100%"
          height="300px"
        />
        <CompleteButton onClick={handleReview}>후기 남기러 가기</CompleteButton>
        <Stat>이번 산책에서 총 이동한 거리: {distance.toFixed(1)} km</Stat>
        <Stat>이번 산책에서 소모한 칼로리: {calories.toFixed(0)} kcal</Stat>
      </Container>
      <Footer />
    </>
  );
};

export default MapStatusComplete;
