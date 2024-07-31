import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getDogInfo, getDogOwnerInfo } from "../../apis/getDogInfo";
import { getCoordinates } from "../../apis/geolocation";
import { getMarkedTrails } from "../../apis/trail";
import { saveWalkData } from "../../apis/walk";
import { getDistance } from "../../utils/getDistance";
import { getUserInfo } from "../../apis/getUserInfo";
import { fetchChatRooms } from "../../apis/chatApi";
import authApi from "../../apis/authApi";
import html2canvas from "html2canvas";
import useUserMap from "../../hooks/useUserMap";

const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const DogInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
  border-radius: 8px;
  cursor: pointer;
`;

const StopButton = styled.button`
  padding: 10px 20px;
  background-color: #ff9900;
  color: white;
  border: none;
  border-radius: 8px;
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

const ChatButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
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

const InfoButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
`;

const InfoModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 300px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const MapStatusUser = () => {
  const { dogId } = useParams(); // URL에서 dogId를 받아옴
  const navigate = useNavigate();
  const [initialLocation, setInitialLocation] = useState({
    latitude: 37.4482020408321,
    longitude: 126.651415033662,
  });
  const [dogInfo, setDogInfo] = useState({ name: "", image: "" });
  const [routes, setRoutes] = useState([]);
  const [showRoutes, setShowRoutes] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [walkStage, setWalkStage] = useState("before");
  const [distance, setDistance] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [socket, setSocket] = useState(null);
  const [ownerId, setOwnerId] = useState(0);
  const [walkUserId, setWalkUserId] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState({});
  const [roomId, setRoomId] = useState(null);

  const { mapContainer, map, currentLocation, setCurrentLocation } = useUserMap(
    process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY,
    dogId,
    selectedRoute ? selectedRoute.name : "",
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const coordinates = await getCoordinates();
        setCurrentLocation(coordinates);
        setInitialLocation(coordinates);

        if (dogId) {
          const response = await getDogInfo(dogId); // dogId를 사용해 강아지 정보를 받아옴
          setDogInfo({
            name: response.dog.name, // 강쥐 이름 설정
            image: response.dog.image, // 강쥐 이미지 설정
          });
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, [dogId, setCurrentLocation]);

  useEffect(() => {
    // ownerId 설정
    const fetchOwnerId = async () => {
      try {
        const ownerInfo = await getDogOwnerInfo(dogId);
        setOwnerId(ownerInfo.owner_id);
      } catch (error) {
        console.error("Error fetching owner id:", error);
      }
    };

    fetchOwnerId();
  }, [dogId]);

  useEffect(() => {
    // walkUserId 설정
    const fetchWalkUserId = async () => {
      try {
        const data = await getUserInfo();
        setWalkUserId(data.id);
      } catch (error) {
        console.error("Error fetching walkuser id:", error);
      }
    };

    fetchWalkUserId();
  }, [dogId]);

  useEffect(() => {
    const setupRoomAndSocket = async () => {
      try {
        await CreateRoom();
      } catch (error) {
        console.error("Error setting up room and socket:", error);
      }
    };

    setupRoomAndSocket();
  }, [ownerId, walkUserId]);

  useEffect(() => {
    if (socket) {
      const intervalId = setInterval(() => {
        SendLocation();
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [socket, ownerId, walkUserId]);

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
    if (walkStage === "during") {
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
  }, [walkStage, initialLocation, setCurrentLocation]);

  const CreateRoom = async () => {
    if (socket) {
      socket.close();
    }
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "walk-status/rooms/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          owner_id: ownerId,
          walk_user_id: walkUserId,
          dog_id: dogId,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const roomData = await response.json();
    setRoomId(roomData.id);
    setUpWebSocket(roomData.id);
  };

  const setUpWebSocket = (roomId) => {
    const newSocket = new WebSocket(
      "wss://" +
        process.env.REACT_APP_BACKEND_DOMAIN +
        `/ws/walk-status/${roomId}/locations`,
    );

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      setSocket(newSocket);
    };

    newSocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      console.log("Received data from socket:", data);
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onclose = () => {
      console.log("WebSocket closed");
      setSocket(null);
    };
  };

  const SendLocation = async () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not open. Skipping location send.");
      return;
    }

    const coordinates = await getCoordinates();
    setInitialLocation(coordinates);
    setCurrentLocation(coordinates);

    const locationPayload = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      walk_user_id: walkUserId,
      owner_id: ownerId,
    };

    socket.send(JSON.stringify(locationPayload));
    console.log("소켓으로 send하는 현재 내 위치:", locationPayload); // 여기서 쏴주는 데이터가 내 위치 데이터입니다.
  };

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
      if (Array.isArray(savedRoutes)) {
        setRoutes(savedRoutes);
      } else {
        setRoutes([]);
      }
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

      if (mapContainer.current) {
        const canvas = await html2canvas(mapContainer.current);
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

  const handleReview = () => navigate(`/review/user`);

  // 칼로리 함수 임시로 추가. 수정 필요!
  const calculateCalories = (distance) => {
    return (distance * 50).toFixed(0);
  };

  const fetchOwnerInfo = async () => {
    try {
      const ownerResponse = await authApi.post("/dogs/owner", {
        dog_id: dogId,
      });
      setOwnerInfo(ownerResponse.data.owner);
      setShowInfo(true);
    } catch (error) {
      console.error("Error fetching owner info:", error);
    }
  };

  const handleChatClick = async () => {
    try {
      const chatRooms = await fetchChatRooms();
      const chatRoom = chatRooms.find((room) => room.other_user_id === ownerId);

      if (chatRoom) {
        navigate(`/chat/rooms/${chatRoom.id}`);
      } else {
        alert("채팅방을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

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
                {routes.length > 0 ? (
                  routes.map((route, index) => (
                    <RouteItem
                      key={index}
                      onClick={() => handleStartWalk(route)}
                    >
                      {route.name}
                    </RouteItem>
                  ))
                ) : (
                  <p>저장된 산책로가 없습니다</p>
                )}
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
            <ButtonContainer>
              <InfoButton onClick={fetchOwnerInfo}>보호자 정보 보기</InfoButton>
              <ChatButton onClick={handleChatClick}>채팅하기</ChatButton>
            </ButtonContainer>
          </>
        );
      case "after":
        return (
          <>
            <Stat>이번 산책에서 총 소요 시간: {timeElapsed}분</Stat>
            <Stat>
              이번 산책에서 소모한 칼로리: {calculateCalories(distance)} kcal
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
        <div ref={mapContainer} style={{ width: "100%", height: "300px" }} />
        {renderWalkStage()}
        {showInfo && (
          <>
            <ModalOverlay onClick={() => setShowInfo(false)} />
            <InfoModal>
              <h2>보호자 정보</h2>
              <p>이메일: {ownerInfo.owner_email}</p>
              <p>프로필 사진: {ownerInfo.owner_image}</p>
              <button onClick={() => setShowInfo(false)}>닫기</button>
            </InfoModal>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default MapStatusUser;
