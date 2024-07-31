import React, { useState } from "react";
import PropTypes from "prop-types";
import { createAppointment } from "../../apis/appointment";

const Calendar = ({ dogId, userId, ownerId, onClose, onSave }) => {
  const [appointment, setAppointment] = useState({
    user_id: userId,
    owner_id: ownerId,
    dog_id: dogId,
    name: "", // 약속 이름
    time: "", // 약속 날짜와 시간
    status: "W", // W, R, F (Waiting, Running, Finish) - 대기중 상태로 기본 설정
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment({
      ...appointment,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createAppointment(appointment);
      onSave(data);
      console.log("약속 생성:", data);
      onClose();
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={appointment.name}
          onChange={handleChange}
          minLength="1"
          maxLength="20"
          required
        />
      </label>
      <label>
        Time:
        <input
          type="datetime-local"
          name="time"
          value={appointment.time}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
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
