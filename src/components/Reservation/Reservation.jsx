import React, { useEffect, useState } from "react";
import styled from "styled-components";
import calendarIcon from "../../assets/icons/icon-calender.png";
import Image from "../Image/Image";
import { getDogInfo } from "../../apis/getDogInfo";
import defaultDogImage from "../../assets/images/add-dog.png"; // 디폴트 이미지 예외처리

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

  useEffect(() => {
    const fetchDogInfo = async () => {
      try {
        const data = await getDogInfo(appointment.dog_id);
        setDog(data);
      } catch (error) {
        console.error("Error fetching dog info:", error);
      }
    };

    if (appointment && appointment.dog_id) {
      fetchDogInfo();
    }
  }, [appointment]);

  if (!dog) {
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
        <Button className="chat">채팅방 바로가기</Button>
        <Button className="start">산책 시작</Button>
      </ButtonsContainer>
    </ReservationContainer>
  );
};

export default Reservation;
