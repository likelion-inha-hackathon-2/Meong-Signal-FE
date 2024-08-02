import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { createAppointment } from "../../apis/appointment";
import useForm from "../../hooks/useForm";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  font-family: "PretendardM";
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  width: 300px;
  text-align: center;
  font-family: "PretendardM";
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "PretendardS";
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
  width: 100%;
  text-align: left;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 14px;
  width: 100%;
  font-family: "PretendardR";
  color: var(--gray-color3);
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "PretendardM";
  font-size: 14px;
  color: white;
  background-color: ${(props) =>
    props.cancel ? "#d9534f" : "var(--yellow-color2)"};
  &:hover {
    background-color: ${(props) =>
      props.cancel ? "#c9302c" : "var(--yellow-color3)"};
  }
  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Calendar = ({ dogId, userId, ownerId, onClose, onSave }) => {
  const { values, handleChange, reset } = useForm({
    user_id: userId,
    owner_id: ownerId,
    dog_id: dogId,
    name: "",
    time: "",
    status: "W",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const kstTime = new Date(values.time);
      kstTime.setHours(kstTime.getHours() + 9);

      const formattedTime = kstTime.toISOString();

      const appointmentWithKST = {
        ...values,
        time: formattedTime,
      };

      const data = await createAppointment(appointmentWithKST);
      onSave(data);
      console.log("약속 생성:", data);
      onClose();
      reset();
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }
  };

  return (
    <ModalBackground>
      <ModalContent>
        <Form onSubmit={handleSubmit}>
          <Label>
            약속 이름:
            <Input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="약속 이름을 입력하세요"
              minLength="1"
              maxLength="20"
              required
            />
          </Label>
          <Label>
            약속 날짜 및 시간:
            <Input
              type="datetime-local"
              name="time"
              value={values.time}
              onChange={handleChange}
              placeholder="약속 날짜와 시간을 선택하세요"
              required
            />
          </Label>
          <ButtonGroup>
            <Button type="submit">약속 보내기</Button>
            <Button type="button" onClick={onClose} cancel>
              닫기
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalBackground>
  );
};

Calendar.propTypes = {
  dogId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  ownerId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Calendar;
