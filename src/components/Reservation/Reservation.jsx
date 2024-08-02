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
import { deleteAppointment, updateAppointment } from "../../apis/appointment";

const ReservationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  background-color: #fff;
  border: 3px solid #eee;
  border-radius: 15px;
  margin: 10px;
  width: 350px;
  height: auto;
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

const PromiseName = styled.div`
  font-size: 14px;
  color: #555;
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
  font-size: 14px;
  font-family: "PretendardM";
`;

const CalendarIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 5px;
  margin-top: 3px;
`;

const ButtonsContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "buttonCount",
})`
  display: ${(props) => (props.buttonCount > 3 ? "grid" : "flex")};
  grid-template-columns: ${(props) =>
    props.buttonCount > 3 ? "1fr 1fr" : "none"};
  gap: 10px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  width: 130px;
  height: 30px;
  padding: 7px 4px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-family: "PretendardM";
  cursor: pointer;
  &.chat {
    background-color: #6bbe6f;
    color: #fff;
  }
  &.start {
    background-color: #f0ad4e;
    color: #fff;
  }
  &.cancel {
    background-color: #d9534f;
    color: #fff;
  }
  &.edit {
    background-color: #5bc0de;
    color: #fff;
  }
`;

const ModalContainer = styled.div`
  position: fixed;
  font-family: "PretendardM";
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  width: 350px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  font-family: "PretendardB";
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalLabel = styled.label`
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
  width: 100%;
  text-align: left;
  font-family: "PretendardM";
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  font-family: "PretendardM";
`;

const ModalButton = styled.button`
  width: 100px;
  padding: 10px;
  margin: 5px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  &.confirm {
    background-color: #5bc0de;
    color: #fff;
  }
  &.cancel {
    background-color: #d9534f;
    color: #fff;
  }
`;

const Reservation = ({ appointment, onCancel }) => {
  const [dog, setDog] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", time: "" });
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ name: appointment.name, time: appointment.time });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAppointment(appointment.id, editData);
      alert("약속을 수정했습니다.");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update the appointment:", error);
      alert("약속을 수정하는데 실패했습니다.");
    }
  };

  if (!dog || !user) {
    return null;
  }

  // 버튼 카운트 동적 계산
  const buttons = [
    <Button key="chat" className="chat" onClick={handleChatNavigate}>
      채팅방 바로가기
    </Button>,
    user.id === appointment.user_id && user.id !== appointment.owner_id && (
      <Button key="start" className="start" onClick={handleWalkNavigate}>
        산책 시작하기
      </Button>
    ),
    <Button key="cancel" className="cancel" onClick={handleCancel}>
      약속 취소하기
    </Button>,
    <Button key="edit" className="edit" onClick={handleEdit}>
      약속 수정하기
    </Button>,
  ].filter(Boolean);

  const button_count = buttons.length;

  return (
    <>
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
            <PromiseName>약속 이름: {appointment.name}</PromiseName>
            <DateInfo>
              <CalendarIcon src={calendarIcon} alt="calendar icon" />
              {new Date(appointment.time).toLocaleString()}
            </DateInfo>
          </TextContainer>
        </DogImageContainer>
        <ButtonsContainer buttonCount={button_count}>
          {buttons}
        </ButtonsContainer>
      </ReservationContainer>

      {isEditing && (
        <ModalContainer>
          <ModalContent>
            <ModalTitle>약속 수정하기</ModalTitle>
            <ModalForm onSubmit={handleEditSubmit}>
              <ModalLabel>
                변경할 약속 이름:
                <ModalInput
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  minLength="1"
                  maxLength="20"
                  required
                />
              </ModalLabel>
              <ModalLabel>
                변경할 약속 시간:
                <ModalInput
                  type="datetime-local"
                  name="time"
                  value={editData.time}
                  onChange={handleEditChange}
                  required
                />
              </ModalLabel>
              <div>
                <ModalButton className="confirm" type="submit">
                  확인
                </ModalButton>
                <ModalButton
                  className="cancel"
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  취소
                </ModalButton>
              </div>
            </ModalForm>
          </ModalContent>
        </ModalContainer>
      )}
    </>
  );
};

Reservation.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    dog_id: PropTypes.number.isRequired,
    user_id: PropTypes.number.isRequired,
    owner_id: PropTypes.number.isRequired,
    time: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Reservation;
