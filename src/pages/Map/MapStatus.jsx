import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MapUser from "../../components/Map/MapUser";
import authApi from "../../apis/authApi"; // 수정된 부분
import { fetchMyDogs } from "../../apis/myDogs";
import { getUserInfo } from "../../apis/getUserInfo";

const Container = styled.div`
  font-family: "PretendardM";
`;

const TitleDogList = styled.div`
  font-family: "PretendardB";
  font-size: 20px;
  margin-bottom: 10px;
`;

const DogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  font-family: "PretendardM";
  font-size: 16px;
`;

const DogItem = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  text-align: left;
  padding: 5px 10px;
  border-radius: 5px;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Message = styled.p`
  font-size: 16px;
  color: #999;
  text-align: center;
  margin-top: 20px;
`;

const MapStatus = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [dogs, setDogs] = useState([]); // 모든 강아지 목록 상태 추가
  const [selectedDogId, setSelectedDogId] = useState(null); // 선택한 강아지의 id
  const [selectedDogName, setSelectedDogName] = useState(""); // 선택된 강아지 이름 상태 추가
  const [selectedDogStatus, setSelectedDogStatus] = useState(""); // 선택된 강아지 상태 추가
  const [walkUserId, setWalkUserId] = useState(""); // 산책자 id
  const [ownerId, setOwnerId] = useState(""); // 견주 id
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);

  // 내 강아지 목록  불러오기
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await fetchMyDogs();
        setDogs(response.dogs);
      } catch (error) {
        console.error("Failed to fetch dogs:", error);
      }
    };

    fetchDogs();
  }, []);

  useEffect(() => {
    // walkUserId 설정
    const fetchWalkUserId = async () => {
      try {
        const data = await getUserInfo();
        setWalkUserId(data.id);
      } catch (error) {
        console.error("Error fetching walk user id:", error);
      }
    };

    fetchWalkUserId();
  }, []);

  useEffect(() => {
    // ownerId 설정
    const fetchOwnerId = async () => {
      try {
        const data = await getUserInfo();
        setOwnerId(data.id);
      } catch (error) {
        console.error("Error fetching owner id:", error);
      }
    };

    fetchOwnerId();
  }, []);

  useEffect(() => {
    const setupRoomAndSocket = async () => {
      try {
        await createRoom(selectedDogId);
      } catch (error) {
        console.error("Error setting up room and socket:", error);
      }
    };

    if (selectedDogId) {
      setupRoomAndSocket();
    }
  }, [selectedDogId]);

  const createRoom = async (dogId) => {
    if (socket) {
      socket.close();
    }

    const response = await authApi.post("/walk-status/rooms/", {
      owner_id: ownerId,
      walk_user_id: walkUserId,
      dog_id: dogId,
    });

    const roomData = response.data;
    setRoomId(roomData.id); // roomId 상태 업데이트

    console.log("roomId:", roomData.id);

    setUpWebSocket(roomData.id);
  };

  const setUpWebSocket = (roomId) => {
    const newSocket = new WebSocket(
      "wss://" +
        process.env.REACT_APP_BACKEND_DOMAIN +
        `/ws/walkroom/${roomId}/locations`,
    );

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      setSocket(newSocket); // 연결되었을 때만 socket 상태 업데이트
    };

    newSocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      console.log("소켓에서 받아온 현재 강아지 위치:", data); // 여기서 받는 데이터가 강아지의 위치 데이터입니다.

      if (data.latitude && data.longitude) {
        setCurrentLocation({
          latitude: data.latitude,
          longitude: data.longitude,
        });
        console.log("setCurrentLocation 수정");
      }
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onclose = () => {
      console.log("WebSocket closed");
      setSocket(null);
    };
  };

  const handleDogClick = (dogId, dogName, dogStatus) => {
    setSelectedDogId(dogId);
    setSelectedDogName(dogName);
    setSelectedDogStatus(dogStatus);
  };

  return (
    <>
      <Header />
      <Container>
        <TitleDogList>🎀우리 강쥐는 어디 있을까요?</TitleDogList>
        <DogList>
          {dogs.map((dog) => (
            <DogItem
              key={dog.id}
              onClick={() => handleDogClick(dog.id, dog.name, dog.status)}
            >
              {dog.name}
            </DogItem>
          ))}
        </DogList>
        {selectedDogName && (
          <>
            {selectedDogStatus === "W" ? (
              <>
                <p>내 강아지 {selectedDogName}이(가) 산책 중이에요!</p>
                <p>현재 여기서 산책 중이에요!</p>
                {currentLocation ? (
                  <MapUser
                    latitude={currentLocation.latitude}
                    longitude={currentLocation.longitude}
                    width="300px"
                    height="300px"
                    dogId={selectedDogId}
                  />
                ) : (
                  <p>위치를 불러오는 중...</p>
                )}
              </>
            ) : (
              <Message>현재 강아지가 산책중인 상태가 아니에요.</Message>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default MapStatus;
