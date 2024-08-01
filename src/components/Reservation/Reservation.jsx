import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import calendarIcon from "../../assets/icons/icon-calender.png";
import Image from "../Image/Image";
import { getDogInfo } from "../../apis/getDogInfo";
import { getUserInfo } from "../../apis/getUserInfo";
import { useNavigate } from "react-router-dom";
import defaultDogImage from "../../assets/images/add-dog.png";
import { getAllChatRooms } from "../../apis/chatApi";

const ReservationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: 5px;
  width: 300px;
  height: 125px;
`;

const DogImageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  pointer-events: none;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 5px;
  font-family: "PretendardM";
`;

const DogName = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  font-family: "PretendardM";
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  color: #888;
  margin-bottom: 2px;
  font-family: "PretendardM";
`;

const CalendarIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 5px;
  margin-top: 3px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 7px 15px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-family: "PretendardM";
  cursor: pointer;
  &.chat {
    background-color: #6bbe6f;
    color: #fff;
    flex-grow: 1;
  }
  &.start {
    background-color: #f0ad4e;
    color: #fff;
  }
`;

const Reservation = ({ appointment }) => {
  const [dog, setDog] = useState(null);
  const [user, setUser] = useState(null); // 유저 정보를 위한 상태를 추가합니다.
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDogInfo = async () => {
      try {
        const data = await getDogInfo(appointment.dog_id);
        setDog(data.dog);
      } catch (error) {
        console.error("Error fetching dog info:", error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo(); // 본인의 유저 정보를 받아옵니다.
        setUser(userInfo);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (appointment && appointment.dog_id) {
      fetchDogInfo();
      fetchUserInfo(); // 컴포넌트가 마운트될 때 유저 정보를 가져옵니다.
    }
  }, [appointment]);

  const handleChatNavigate = async () => {
    try {
      const chatRooms = await getAllChatRooms();
      const matchingRoom = chatRooms.find(
        (room) =>
          (room.owner_user === appointment.user_id &&
            room.dog_id === appointment.dog_id) ||
          (room.user_user === appointment.user_id &&
            room.dog_id === appointment.dog_id),
      );
      if (matchingRoom) {
        navigate(`/chat/rooms/${matchingRoom.id}`);
      } else {
        alert("채팅방이 개설되지 않았습니다.");
        console.error("Matching chat room not found");
      }
    } catch (error) {
      console.error("Failed to navigate to chat room:", error);
    }
  };

  const handleWalkNavigate = () => {
    navigate(`/map-status/${appointment.dog_id}`);
  };

  if (!dog || !user) {
    return null; // dog와 user 정보가 모두 준비될 때까지 null을 반환합니다.
  }

  return (
    <ReservationContainer>
      <DogImageContainer>
        <Image
          src={dog.image || defaultDogImage}
          width="50px"
          height="50px"
          alt={`${dog.name}`}
          borderRadius="50%"
        />
        <TextContainer>
          <DogName>{dog.name}랑 만나는 날!</DogName>
          <DateInfo>
            <CalendarIcon src={calendarIcon} alt="calendar icon" />
            {new Date(appointment.time).toLocaleString()}
          </DateInfo>
        </TextContainer>
      </DogImageContainer>
      <ButtonsContainer>
        <Button className="chat" onClick={handleChatNavigate}>
          채팅방 바로가기
        </Button>
        {user.id === appointment.user_id &&
          user.id !== appointment.owner_id && (
            <Button className="start" onClick={handleWalkNavigate}>
              산책 시작하기
            </Button>
          )}
      </ButtonsContainer>
    </ReservationContainer>
  );
};

Reservation.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    dog_id: PropTypes.number.isRequired,
    user_id: PropTypes.number.isRequired,
    owner_id: PropTypes.number.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
};

export default Reservation;
