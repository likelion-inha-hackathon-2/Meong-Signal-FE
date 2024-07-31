import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { updateAppointment } from "../../apis/appointment";

const ScheduleContainer = styled.div`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  padding: 20px;
  width: 300px;
  font-family: "PretendardM";
  text-align: center;
`;

const Title = styled.h3`
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const Detail = styled.p`
  margin: 5px 0;
  font-size: 14px;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "PretendardM";
  font-size: 14px;
  color: white;
  background-color: ${(props) =>
    props.status === "R" ? "green" : props.status === "W" ? "orange" : "red"};
  &:hover {
    background-color: ${(props) =>
      props.status === "R"
        ? "#2bb14a"
        : props.status === "W"
          ? "#ffc107"
          : "#ff3348"};
  }
`;

const Schedule = ({ appointment, onUpdate }) => {
  const handleStatusChange = async (status) => {
    try {
      const updatedAppointment = await updateAppointment(appointment.id, {
        ...appointment,
        status,
      });
      onUpdate(updatedAppointment); // 채팅방에 전달
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  return (
    <ScheduleContainer>
      <Title>약속내용</Title>
      <Detail>
        <strong>약속 이름: </strong> {appointment.name}
      </Detail>
      <Detail>
        <strong>약속 시간과 날짜:</strong> {appointment.time}
      </Detail>
      <ButtonGroup>
        <ActionButton status="R" onClick={() => handleStatusChange("R")}>
          수락
        </ActionButton>
      </ButtonGroup>
    </ScheduleContainer>
  );
};

Schedule.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default Schedule;
