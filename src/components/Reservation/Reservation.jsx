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
import { deleteAppointment } from "../../apis/appointment";

const ReservationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background-color: #fff;
  border: 3px solid #eee;
  border-radius: 10px;
  margin-bottom: 5px;
  width: 350px;
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
  padding-left: 5px;
  font-family: "PretendardM";
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  padding-left: 3px;
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
  padding: 7px 10px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-family: "PretendardM";
  cursor: pointer;
  // 채팅 버튼
  &.chat {
    background-color: #6bbe6f;
    color: #fff;
    flex-grow: 1;
  }
  // 산책 시작
  &.start {
    background-color: #f0ad4e;
    color: #fff;
  }
  // 약속 취소
  &.cancel {
    background-color: #d9534f;
    color: #fff;
  }
`;

const Reservation = ({ appointment, onCancel }) => {
  const [dog, setDog] = useState(null);
  const [user, setUser] = useState(null);
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
        const userInfo = await getUserInfo();
        setUser(userInfo);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (appointment && appointment.dog_id) {
      fetchDogInfo();
      fetchUserInfo();
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

  const handleCancel = async () => {
    try {
      await deleteAppointment(appointment.id);
      alert("약속을 거절했습니다.");
      onCancel(appointment.id); // 부모 컴포넌트로 스케쥴 id를 전달
    } catch (error) {
      console.error("Failed to cancel the appointment:", error);
      alert("약속을 거절하는데 실패했습니다.");
    }
  };

  if (!dog || !user) {
    return null;
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
        <Button className="cancel" onClick={handleCancel}>
          약속 취소하기
        </Button>
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
  onCancel: PropTypes.func.isRequired,
};

export default Reservation;
