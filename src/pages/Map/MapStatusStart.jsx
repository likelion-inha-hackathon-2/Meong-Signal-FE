import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MapUser from "../../components/Map/MapUser";
import { getDogInfo } from "../../apis/getDogInfo";
import { getCoordinates } from "../../apis/geolocation";
import { getMarkedTrails } from "../../apis/trail"; // 저장된 산책로 가져오는 API

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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
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

const RouteButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
`;

const RouteList = styled.div`
  margin-top: 20px;
`;

const RouteItem = styled.div`
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  border-radius: 5px;
  cursor: pointer;
`;

const MapStatusStart = () => {
  const { dogId } = useParams();
  const navigate = useNavigate();
  const [dogInfo, setDogInfo] = useState({});
  const [routes, setRoutes] = useState([]);
  const [showRoutes, setShowRoutes] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const coordinates = await getCoordinates();
        setCurrentLocation({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, []);

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

  const handleStartWalk = (route = null) => {
    if (route) {
      setSelectedRoute(route);
      alert(`${route.name}을 목표 지점으로 산책을 시작합니다!`);
    } else {
      alert("산책을 시작합니다!");
    }
    navigate(`/map-status-walking/${dogId}`);
  };

  const handleShowRoutes = async () => {
    try {
      const savedRoutes = await getMarkedTrails();
      setRoutes(savedRoutes || []);
      setShowRoutes(true);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setRoutes([]);
    }
  };

  return (
    <>
      <Header />
      <Container>
        <DogInfo>
          <DogImage src={dogInfo.image} alt={dogInfo.name} />
          <DogName>{dogInfo.name}와 산책을 시작합니다!</DogName>
        </DogInfo>
        <MapUser
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
          width="100%"
          height="300px"
          dogId={dogId}
          keyword={selectedRoute ? selectedRoute.name : ""} // keyword prop 추가
        />
        <ButtonContainer>
          <StartButton onClick={() => handleStartWalk()}>
            미지정 산책 시작
          </StartButton>
          <RouteButton onClick={handleShowRoutes}>
            저장된 경로 불러오기
          </RouteButton>
        </ButtonContainer>
        {showRoutes && (
          <RouteList>
            <h1>산책로 선택</h1>
            {routes.map((route, index) => (
              <RouteItem key={index} onClick={() => handleStartWalk(route)}>
                {route.name}
              </RouteItem>
            ))}
          </RouteList>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default MapStatusStart;
