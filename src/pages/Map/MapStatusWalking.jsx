import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import html2canvas from "html2canvas";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MapUser from "../../components/Map/MapUser";
import { getDogInfo } from "../../apis/getDogInfo";
import { getDistance } from "../../utils/getDistance.js";
import { getCoordinates } from "../../apis/geolocation";
import { saveWalkData } from "../../apis/walk";

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

const MapStatusWalking = () => {
  const { dogId } = useParams(); // dogId를 useParams로 가져옵니다.
  const navigate = useNavigate();
  const [dogInfo, setDogInfo] = useState({});
  const [initialLocation, setInitialLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [distance, setDistance] = useState(0);
  const [isWalking, setIsWalking] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchInitialCoordinates = async () => {
      try {
        const coordinates = await getCoordinates();
        setInitialLocation(coordinates);
        setCurrentLocation(coordinates);
        localStorage.setItem("startTime", new Date().toISOString());
      } catch (error) {
        console.error("Error fetching initial coordinates:", error);
      }
    };

    fetchInitialCoordinates();
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

  useEffect(() => {
    let interval;
    if (isWalking) {
      interval = setInterval(() => {
        const startTime = new Date(localStorage.getItem("startTime"));
        setTimeElapsed(Math.floor((new Date() - startTime) / 60000));
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [isWalking]);

  useEffect(() => {
    if (isWalking) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCurrentLocation = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          };
          setCurrentLocation(newCurrentLocation);

          if (initialLocation.latitude && initialLocation.longitude) {
            const dist = getDistance(
              initialLocation.latitude,
              initialLocation.longitude,
              newCurrentLocation.latitude,
              newCurrentLocation.longitude,
            );
            if (!isNaN(dist)) {
              setDistance(dist);
              localStorage.setItem("walkDistance", dist);
            }
          }
        },
        (error) => console.error(error),
        { enableHighAccuracy: true },
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [isWalking, initialLocation]);

  const handleEndWalk = async () => {
    setIsWalking(false);

    try {
      if (mapRef.current) {
        const canvas = await html2canvas(mapRef.current);
        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append("dog_id", dogId);
          formData.append("time", timeElapsed);
          formData.append("distance", distance);
          formData.append("image", blob);

          await saveWalkData(formData);
          alert("산책 데이터가 성공적으로 저장되었습니다.");
        }, "image/png");
      }
    } catch (error) {
      console.error("Error saving walk data:", error);
      alert("산책 데이터를 저장하는 중에 오류가 발생했습니다.");
    }
  };

  const handleReview = () => {
    navigate(`/reviews/${dogId}`);
  };

  return (
    <>
      <Header />
      <Container>
        <DogInfo>
          <div style={{ display: "flex", alignItems: "center" }}>
            <DogImage src={dogInfo.image} alt={dogInfo.name} />
            <DogName>
              {dogInfo.name}
              {isWalking ? "와 산책중입니다!" : "와의 산책이 종료되었습니다."}
            </DogName>
          </div>
          <div>
            {isWalking ? (
              <>
                <InfoButton>정보 보기</InfoButton>
                <InfoButton>보호자와 채팅하기</InfoButton>
              </>
            ) : (
              <CompleteButton onClick={handleReview}>
                후기 남기러 가기
              </CompleteButton>
            )}
          </div>
        </DogInfo>
        <div ref={mapRef}>
          {initialLocation.latitude && initialLocation.longitude && (
            <MapUser
              latitude={currentLocation.latitude}
              longitude={currentLocation.longitude}
              width="100%"
              height="300px"
              dogId={dogId} // MapUser에 dogId를 전달합니다.
            />
          )}
        </div>
        {isWalking ? (
          <>
            <StopButton onClick={handleEndWalk}>산책 종료</StopButton>
            <Stat>지금까지 {timeElapsed}분 동안</Stat>
            <Stat>{distance.toFixed(1)}km를 이동하셨어요!</Stat>
          </>
        ) : (
          <>
            <Stat>이번 산책에서 총 소요 시간: {timeElapsed}분</Stat>
            <Stat>
              이번 산책에서 소모한 칼로리: {(distance * 50).toFixed(0)} kcal
            </Stat>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default MapStatusWalking;
