import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MapUser from "../../components/Map/MapUser";
import authApi from "../../apis/authApi";
import { getUserInfo } from "../../apis/getUserInfo";
import { getMyWalkingDogInfo } from "../../apis/walk";

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
  const [walkingDog, setWalkingDog] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [walkUserId, setWalkUserId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [socket, setSocket] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [roomId, setRoomId] = useState(null);

  // ownerId 설정
  useEffect(() => {
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

  // 산책 중인 강아지 목록 불러오기
  useEffect(() => {
    const fetchWalkingDogs = async () => {
      try {
        const data = await getMyWalkingDogInfo();
        if (data.walking_dogs && data.walking_dogs.length > 0) {
          const walkingDog = data.walking_dogs.find((dog) => dog.walk_user_id);
          if (walkingDog) {
            setWalkingDog(walkingDog);
            setWalkUserId(walkingDog.walk_user_id); // 산책자 id
          } else {
            setWalkingDog(null);
          }
          setDogs(data.walking_dogs.filter((dog) => !dog.walk_user_id));
        } else {
          setWalkingDog(null);
          setDogs([]);
        }
      } catch (error) {
        console.error("Error fetching walking dogs:", error);
      }
    };

    fetchWalkingDogs();
  }, []);

  useEffect(() => {
    const setupRoomAndSocket = async () => {
      if (
        selectedDog &&
        selectedDog.walk_user_id &&
        selectedDog.walk_user_id !== ownerId
      ) {
        try {
          await createRoom(selectedDog.dog_id);
        } catch (error) {
          console.error("Error setting up room and socket:", error);
        }
      }
    };

    setupRoomAndSocket();
  }, [selectedDog, ownerId]);

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
    setRoomId(roomData.id);
    setUpWebSocket(roomData.id);
    console.log("roomId:", roomData.id);
    console.log(walkUserId);
  };

  const setUpWebSocket = (roomId) => {
    const newSocket = new WebSocket(
      "wss://" +
        process.env.REACT_APP_BACKEND_DOMAIN +
        `/ws/walkroom/${roomId}/locations`,
    );

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      setSocket(newSocket);
    };

    newSocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      console.log("소켓에서 받아온 현재 강아지 위치:", data);

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

  const handleDogClick = async (dog) => {
    setSelectedDog(dog);
    setWalkUserId(dog.walk_user_id);
    if (dog.walk_user_id && dog.walk_user_id !== ownerId) {
      try {
        await createRoom(dog.dog_id);
      } catch (error) {
        console.error("Error setting up room and socket:", error);
      }
    } else {
      setCurrentLocation(null); // Reset current location if no walk_user_id
    }
  };

  return (
    <>
      <Header />
      <Container>
        <TitleDogList>우리 강쥐는 어디 있을까요?</TitleDogList>
        <DogList>
          {walkingDog ? (
            <DogItem
              key={`${walkingDog.dog_id}-${walkingDog.walk_user_id}`}
              onClick={() => handleDogClick(walkingDog)}
            >
              🐶 {walkingDog.dog_name}
            </DogItem>
          ) : (
            <Message>현재 산책 중인 강아지가 없습니다.</Message>
          )}
        </DogList>
        {selectedDog && (
          <>
            {selectedDog.walk_user_id &&
            selectedDog.walk_user_id !== ownerId ? (
              <>
                <p>내 강아지 {selectedDog.dog_name}이(가) 산책 중이에요!</p>
                <p>현재 여기서 산책 중이에요!</p>
                {currentLocation ? (
                  <MapUser
                    latitude={currentLocation.latitude}
                    longitude={currentLocation.longitude}
                    width="300px"
                    height="300px"
                    dogId={selectedDog.dog_id}
                  />
                ) : (
                  <p>위치를 불러오는 중...</p>
                )}
              </>
            ) : (
              <p>{selectedDog.dog_name}은(는) 현재 산책 중이 아닙니다.</p>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default MapStatus;
