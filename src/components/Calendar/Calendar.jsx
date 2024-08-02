import React, { useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { createAppointment } from "../../apis/appointment";
import "../../calendarStyles.css"; 
import { ko } from "date-fns/locale";
import { format, setHours, setMinutes } from "date-fns";

const CalendarContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
  margin: auto;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const Label = styled.label`
  font-family: "PretendardR";
  font-size: 14px;
  color: #333;
`;
const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: "PretendardR";
  font-size: 14px;
`;
const Button = styled.button`
  padding: 10px 20px;
  background-color: var(--yellow-color2);
  border: none;
  border-radius: 5px;
  font-family: "PretendardB";
  font-size: 14px;
  color: white;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: var(--yellow-color3);
  }
`;
const ReactCalendarWrapper = styled.div`
  margin-bottom: 15px;
  .react-datepicker {
    width: 100%;
  }
  .react-datepicker__month-container {
    width: 100%;
  }
`;
const TimePickerWrapper = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
`;
const HolidayDot = styled.div`
  width: 6px;
  height: 6px;
  background-color: red;
  border-radius: 50%;
  margin: 0 auto;
  margin-top: 0;
`;
const holidays = [
  '2024-01-01',
  '2024-02-09',
  '2024-02-10',
  '2024-02-11',
  '2024-02-12',
  '2024-03-01',
  '2024-04-10',
  '2024-05-05',
  '2024-05-06',
  '2024-05-15',
  '2024-06-06',
  '2024-08-15',
  '2024-09-16',
  '2024-09-17',
  '2024-09-18',
  '2024-10-03',
  '2024-10-09',
  '2024-12-25'
];
const isHoliday = (date) => {
  return holidays.includes(format(date, 'yyyy-MM-dd'));
};
const AppointmentCalendar = ({ dogId, userId, ownerId, onClose, onSave }) => {
  const [appointment, setAppointment] = useState({
    user_id: userId,
    owner_id: ownerId,
    dog_id: dogId,
    name: "", // 약속 이름
    time: "", // 약속 날짜와 시간
    status: "W", // W, R, F (Waiting, Running, Finish) - 대기중 상태로 기본 설정
  });
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [amPm, setAmPm] = useState(format(new Date(), 'HH') >= 12 ? '오후' : '오전');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment({
      ...appointment,
      [name]: value,
    });
  };
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    updateAppointmentTime(selectedDate, time, amPm);
  };
  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setTime(selectedTime);
    updateAppointmentTime(date, selectedTime, amPm);
  };
  const handleAmPmChange = (e) => {
    const selectedAmPm = e.target.value;
    setAmPm(selectedAmPm);
    updateAppointmentTime(date, time, selectedAmPm);
  };
  const updateAppointmentTime = (selectedDate, selectedTime, selectedAmPm) => {
    const [hours, minutes] = selectedTime.split(':');
    let newHours = parseInt(hours);
    if (selectedAmPm === '오후' && newHours < 12) {
      newHours += 12;
    } else if (selectedAmPm === '오전' && newHours >= 12) {
      newHours -= 12;
    }
    const newDate = setHours(setMinutes(selectedDate, minutes), newHours);
    setAppointment({
      ...appointment,
      time: newDate.toISOString(),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const kstTime = new Date(appointment.time);
      kstTime.setHours(kstTime.getHours() + 9); // 9시간을 더하여 KST로 변환
      const formattedTime = kstTime.toISOString();
      const appointmentWithKST = {
        ...appointment,
        time: formattedTime,
      };
      const data = await createAppointment(appointmentWithKST);
      onSave(data);
      console.log("약속 생성:", data);
      setTimeout(onClose, 2000); // 약속이 생성된 후에 onClose를 2초 뒤에 호출
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }
  };
  // 10분 단위로 시간을 생성하는 함수
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  };
  const timeOptions = generateTimeOptions();
  const amPmOptions = ['오전', '오후'];
  return (
    <CalendarContainer>
      <Form onSubmit={handleSubmit}>
        <Label>
          약속 이름:
          <Input
            type="text"
            name="name"
            value={appointment.name}
            onChange={handleChange}
            minLength="1"
            maxLength="20"
            required
          />
        </Label>
        <Label>
          날짜:
          <ReactCalendarWrapper>
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              dateFormat="yyyy/MM/dd"
              locale={ko}
              inline
              renderDayContents={(day, date) => (
                <div>
                  <span>{day}</span>
                  {isHoliday(date) && <HolidayDot />}
                </div>
              )}
            />
          </ReactCalendarWrapper>
        </Label>
        <Label>
          시간:
          <TimePickerWrapper>
            <select onChange={handleAmPmChange} value={amPm}>
              {amPmOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select onChange={handleTimeChange} value={time}>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </TimePickerWrapper>
        </Label>
        <Button type="submit">약속 잡기</Button>
      </Form>
    </CalendarContainer>
  );
};
AppointmentCalendar.propTypes = {
  dogId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  ownerId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
export default AppointmentCalendar;
