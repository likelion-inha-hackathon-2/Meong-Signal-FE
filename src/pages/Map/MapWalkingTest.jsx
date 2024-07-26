import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Map from "../../components/Map/Map";
import { getCoordinates } from "../../apis/geolocation";

const MapWalkingTest = () => {
  const [initialLocation, setInitialLocation] = useState({
    latitude: 37.4482020408321,
    longitude: 126.651415033662,
  }); // 초기 좌표 인하대
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [walkUserEmail, setWalkUserEmail] = useState("walking@gmail.com"); // 고정 산책자 이메일
  const [ownerEmail, setOwnerEmail] = useState("owner@gmail.com"); // 고정 견주 이메일
  const [roomId, setRoomId] = useState(null);
  const [socket, setSocket] = useState(null);

  // Create room and set up WebSocket when component mounts

  useEffect(() => {
    // 견주, 산책자 이메일 얻어와서 walkUserEmail, ownerEmail 업데이트하는 로직
  }, []);

  useEffect(() => {
    const setupRoomAndSocket = async () => {
      try {
        await CreateRoom();
      } catch (error) {
        console.error("Error setting up room and socket:", error);
      }
    };

    setupRoomAndSocket();
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    // Set up interval to send location every 3 seconds if WebSocket is connected
    if (socket) {
      const intervalId = setInterval(() => {
        SendLocation();
      }, 3000);

      // Clean up interval on WebSocket close
      return () => clearInterval(intervalId);
    }
  }, [socket]); // Dependency array includes socket

  const CreateRoom = async () => {
    if (socket) {
      socket.close();
    }
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      "https://meong-signal.kro.kr/walk-status/rooms/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          owner_email: ownerEmail,
          walk_user_email: walkUserEmail,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const roomData = await response.json();
    setRoomId(roomData.id); // Update roomId state

    console.log("roomId:", roomData.id);

    SetUpWebSocket(roomData.id);
  };

  const SetUpWebSocket = (roomId) => {
    const newSocket = new WebSocket(
      `wss://meong-signal.kro.kr/ws/room/${roomId}/locations`,
    );

    console.log("newSocket=", newSocket);

    newSocket.onopen = () => {
      setSocket(newSocket); // Update socket state only when connected
      console.log("WebSocket 연결 성공");
    };

    newSocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onclose = () => {
      console.log("WebSocket closed");
      setSocket(null); // Reset socket state when closed
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
      owner_email: ownerEmail,
      walk_user_email: walkUserEmail,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };

    socket.send(JSON.stringify(locationPayload));
    console.log("소켓으로 send하는 현재 내 위치:", locationPayload); // 여기서 쏴주는 데이터가 내 위치 데이터입니다.
  };

  return (
    <>
      <Header />
      <Map
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
        width="300px"
        height="300px"
      />
      <Footer />
    </>
  );
};

export default MapWalkingTest;
