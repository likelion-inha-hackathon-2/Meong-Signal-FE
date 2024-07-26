import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MapUser from "../../components/Map/MapUser";
import { getDogInfo } from "../../apis/getDogInfo";
import { getCoordinates } from "../../apis/geolocation";
import { getMarkedTrails } from "../../apis/trail";
import { saveWalkData } from "../../apis/walk";
import { getDistance } from "../../utils/getDistance";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

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

const MapStatusUser = () => {
  const { dogId } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const [dogInfo, setDogInfo] = useState({ name: "", image: "" });
  const [routes, setRoutes] = useState([]);
  const [showRoutes, setShowRoutes] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialLocation, setInitialLocation] = useState(null);
  // 산책 상태 3개로 나눠서 초기 상태는 산책 전으로
  const [walkStage, setWalkStage] = useState("before"); // 산책 전, 산책 중, 산책 후로 관리
  const [distance, setDistance] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const coordinates = await getCoordinates();
        setCurrentLocation(coordinates);
        setInitialLocation(coordinates);

        if (dogId) {
          const data = await getDogInfo(dogId);
          setDogInfo(data.dog);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [dogId]);

  useEffect(() => {
    if (walkStage === "during") {
      const interval = setInterval(() => {
        const startTime = new Date(localStorage.getItem("startTime") || "");
        const currentTime = new Date();
        const timeElapsedInMinutes = Math.floor(
          (currentTime - startTime) / 60000,
        );
        setTimeElapsed(timeElapsedInMinutes);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [walkStage]);

  useEffect(() => {
    if (walkStage === "during" && initialLocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newCurrentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(newCurrentLocation);

          const dist = getDistance(initialLocation, newCurrentLocation);
          setDistance((prevDistance) => {
            const newDistance = prevDistance + dist;
            localStorage.setItem("walkDistance", newDistance.toString());
            return newDistance;
          });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true },
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [walkStage, initialLocation]);

  const handleStartWalk = (route = null) => {
    setSelectedRoute(route);
    setWalkStage("during");
    localStorage.setItem("startTime", new Date().toISOString());
    alert(
      route
        ? `${route.name}을 목표 지점으로 산책을 시작합니다!`
        : "산책을 시작합니다!",
    );
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

  const handleEndWalk = async () => {
    setWalkStage("after");

    try {
      const formData = new FormData();
      formData.append("dog_id", dogId);
      formData.append("time", timeElapsed.toString());
      formData.append("distance", distance.toFixed(1));

      if (mapRef.current) {
        const canvas = await html2canvas(mapRef.current);
        canvas.toBlob(async (blob) => {
          if (blob) {
            formData.append("image", blob, "walk_image.png");
          }

          await saveWalkData(formData);
          alert("산책 데이터가 성공적으로 저장되었습니다.");
        }, "image/png");
      } else {
        await saveWalkData(formData);
        alert("산책 데이터가 성공적으로 저장되었습니다.");
      }
    } catch (error) {
      console.error("Error saving walk data:", error);
      alert("산책 데이터를 저장하는 중에 오류가 발생했습니다.");
    }
  };
  const handleReview = () => navigate(`/reviews/${dogId}`);

  const renderWalkStage = () => {
    switch (walkStage) {
      case "before":
        return (
          <>
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
          </>
        );
      case "during":
        return (
          <>
            <StopButton onClick={handleEndWalk}>산책 종료</StopButton>
            <Stat>지금까지 {timeElapsed}분 동안</Stat>
            <Stat>{distance.toFixed(1)}km를 이동하셨어요!</Stat>
          </>
        );
      case "after":
        return (
          <>
            <Stat>이번 산책에서 총 소요 시간: {timeElapsed}분</Stat>
            <Stat>
              이번 산책에서 소모한 칼로리: {(distance * 50).toFixed(0)} kcal
            </Stat>
            <CompleteButton onClick={handleReview}>
              후기 남기러 가기
            </CompleteButton>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <Container>
        <DogInfo>
          <DogImage src={dogInfo.image} alt={dogInfo.name} />
          <DogName>
            {dogInfo.name}
            {walkStage === "during"
              ? "와 산책중입니다!"
              : walkStage === "before"
                ? "과 산책을 시작합니다."
                : "와의 산책이 종료되었습니다."}
          </DogName>
        </DogInfo>
        <div ref={mapRef}>
          {currentLocation ? (
            <MapUser
              latitude={currentLocation.latitude}
              longitude={currentLocation.longitude}
              width="100%"
              height="300px"
              dogId={dogId}
              keyword={selectedRoute ? selectedRoute.name : ""}
            />
          ) : (
            <p>현재 위치를 불러오는 중...</p>
          )}
        </div>
        {renderWalkStage()}
      </Container>
      <Footer />
    </>
  );
};

export default MapStatusUser;
