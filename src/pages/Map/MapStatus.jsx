import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MapUser from "../../components/Map/MapUser";
import authApi from "../../apis/authApi"; // 수정된 부분
import { fetchMyDogs } from "../../apis/myDogs";

const Container = styled.div`
  font-family: "PretendardM";
`;

const DogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
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

const MapStatus = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [walkingDogs, setWalkingDogs] = useState([]); // 산책 중인 강아지 목록 상태 추가
  const [selectedDogId, setSelectedDogId] = useState(null); // 선택한 강아지의 id
  const [selectedDogName, setSelectedDogName] = useState(""); // 선택된 강아지 이름 상태 추가
  const [walkUserEmail, setWalkUserEmail] = useState("walking@gmail.com"); // 고정 산책자 이메일
  const [ownerEmail, setOwnerEmail] = useState("owner@gmail.com"); // 고정 견주 이메일
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);

  // 내 강아지 목록 중에서 산책 중인 강아지가 있다면 불러오기
  useEffect(() => {
    const fetchWalkingDogs = async () => {
      try {
        const response = await fetchMyDogs();
        const walkingDogs = response.dogs.filter((dog) => dog.status === "W");
        setWalkingDogs(walkingDogs);
      } catch (error) {
        console.error("Failed to fetch walking dogs:", error);
      }
    };

    fetchWalkingDogs();
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
      owner_email: ownerEmail,
      walk_user_email: walkUserEmail,
      dog_id: dogId,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const roomData = response.data;
    setRoomId(roomData.id); // roomId 상태 업데이트

    console.log("roomId:", roomData.id);

    setUpWebSocket(roomData.id);
  };

  const setUpWebSocket = (roomId) => {
    const newSocket = new WebSocket(
      `wss://meong-signal.kro.kr/ws/walkroom/${roomId}/locations`,
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

  const handleDogClick = (dogId, dogName) => {
    setSelectedDogId(dogId);
    setSelectedDogName(dogName);
  };

  return (
    <>
      <Header />
      <Container>
        <DogList>
          {walkingDogs.map((dog) => (
            <DogItem
              key={dog.id}
              onClick={() => handleDogClick(dog.id, dog.name)}
            >
              {dog.name}
            </DogItem>
          ))}
        </DogList>
        {selectedDogName && (
          <>
            <p>내 강아지 {selectedDogName}이(가) 산책 중이에요!</p>
            <p>현재 여기서 산책 중이에요!</p>
            {currentLocation ? (
              <MapUser
                latitude={currentLocation.latitude}
                longitude={currentLocation.longitude}
                width="300px"
                height="300px"
              />
            ) : (
              <p>위치를 불러오는 중...</p>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default MapStatus;
