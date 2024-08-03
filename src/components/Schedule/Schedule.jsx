import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import { formatTimestamp } from "../../utils/time";

const ScheduleContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  padding: 20px;
  width: 300px;
  font-family: "PretendardM";
  z-index: 1002;
`;

const Title = styled.h3`
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
  font-size: 16px;
  color: #666;
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px 0;
`;

const Label = styled.div`
  font-weight: bold;
  color: #333;
  font-size: 16px;
  margin-bottom: 5px;
`;

const Value = styled.div`
  color: #666;
`;

const ActionButton = styled(Button)`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "PretendardM";
  font-size: 14px;
  color: white;
  background-color: var(--yellow-color2);
  &:hover {
    background-color: var(--yellow-color3);
  }
  margin-top: 20px;
`;

// eslint-disable-next-line no-unused-vars
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const Schedule = ({ appointment, onUpdate, onClose }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    alert("약속을 성공적으로 전송했어요!");
    navigate("/chat"); // 다시 채팅방 목록으로 이동하기
  };

  return (
    <ScheduleContainer>
      <Title>약속 내용</Title>
      <Detail>
        <DetailRow>
          <Label>약속 이름:</Label>
          <Value>{appointment.name}</Value>
        </DetailRow>
        <DetailRow>
          <Label>약속 시간과 날짜:</Label>
          <Value>{formatTimestamp(appointment.time)}</Value>
        </DetailRow>
      </Detail>
      <ActionButton text="확인" onClick={handleClose}></ActionButton>
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
  onClose: PropTypes.func.isRequired,
};

export default Schedule;
