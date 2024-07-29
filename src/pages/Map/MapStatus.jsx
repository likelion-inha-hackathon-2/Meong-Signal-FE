import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MapUser from "../../components/Map/MapUser";
import { getDogInfo } from "../../apis/getDogInfo";
import authApi from "../../apis/authApi"; // 수정된 부분
import { fetchMyDogs } from "../../apis/myDogs";

const Container = styled.div`
  font-family: "PretendardM";
`;

const MapStatus = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [dogName, setDogName] = useState(""); // 강아지 이름 상태 추가
  const [walkUserEmail, setWalkUserEmail] = useState("walking@gmail.com"); // 고정 산책자 이메일
  const [ownerEmail, setOwnerEmail] = useState("owner@gmail.com"); // 고정 견주 이메일
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [dogId, setDogId] = useState(null); // dogId 상태 추가

  useEffect(() => {
    const fetchWalkingDog = async () => {
      try {
        const data = await fetchMyDogs();
        const walkingDog = data.dogs.find((dog) => dog.status === "W");
        if (walkingDog) {
          setDogId(walkingDog.id);
        }
      } catch (error) {
        console.error("Failed to fetch walking dog:", error);
      }
    };

    fetchWalkingDog();
  }, []);

  useEffect(() => {
    if (dogId) {
      const fetchDogInfo = async () => {
        try {
          const data = await getDogInfo(dogId);
          setDogName(data.dog.name);
          console.log(data);
        } catch (error) {
          console.error("Error fetching dog info:", error);
        }
      };

      fetchDogInfo();
    }
  }, [dogId]);

  useEffect(() => {
    const setupRoomAndSocket = async () => {
      try {
        await createRoom();
      } catch (error) {
        console.error("Error setting up room and socket:", error);
      }
    };

    setupRoomAndSocket();
  }, []);

  const createRoom = async () => {
    if (socket) {
      socket.close();
    }

    const response = await authApi.post("/walk-status/rooms/", {
      owner_email: ownerEmail,
      walk_user_email: walkUserEmail,
    });

    if (!response.status === 200) {
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

  return (
    <>
      <Header />
      <Container>
        {dogName ? (
          <>
            <p>내 강아지 {dogName}이 산책 중이에요!</p>
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
        ) : (
          <p>산책 중인 강아지가 없습니다</p>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default MapStatus;
