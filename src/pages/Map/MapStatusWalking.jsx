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

// 칼로리 계산 함수
const get_calories = (distance, time, weight_kg = 70) => {
  const METs = 3.5;
  const calories_burned = (time * METs * weight_kg * 3.5) / 200;
  return calories_burned;
};

const MapStatusWalking = () => {
  const { dogId } = useParams();
  const navigate = useNavigate();
  const [dogInfo, setDogInfo] = useState({});
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.4482020408321,
    longitude: 126.651415033662,
  });
  const [initialLocation, setInitialLocation] = useState(currentLocation);
  const [previousLocation, setPreviousLocation] = useState(null);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [startTime, setStartTime] = useState(null);

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
        setPreviousLocation(coordinates);
        setStartTime(new Date()); // 산책 시작 시간 설정
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCurrentLocation = {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        };
        setCurrentLocation(newCurrentLocation);

        if (previousLocation) {
          const dist = getDistance(
            previousLocation.latitude,
            previousLocation.longitude,
            newCurrentLocation.latitude,
            newCurrentLocation.longitude
          );
          setDistance((prev) => prev + dist);

          // 시간 계산 (분 단위)
          const currentTime = new Date();
          const timeElapsed = (currentTime - startTime) / 60000; // 밀리초를 분으로 변환
          const totalCalories = get_calories(distance + dist, timeElapsed);
          setCalories(totalCalories);

          // 로컬 스토리지에 저장
          localStorage.setItem('walkDistance', (distance + dist).toString());
          localStorage.setItem('walkCalories', totalCalories.toString());
        }
        setPreviousLocation(newCurrentLocation);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [previousLocation, startTime, distance]);

  const handleEndWalk = () => {
    navigate(`/map-status-complete/${dogId}`); // 산책 완료 페이지로 이동
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
        <Map2
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
          width="100%"
          height="300px"
          dogId={dogId} // dogId 전달
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
