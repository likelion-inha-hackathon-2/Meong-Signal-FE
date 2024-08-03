import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
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
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
    font-family: "PretendardR";
  }
  .react-datepicker__month-container {
    width: 100%;
  }
  .react-datepicker__header {
    background-color: var(--yellow-color1);
    border-bottom: 1px solid #e0e0e0;
  }
  .react-datepicker__current-month {
    font-family: "PretendardB";
    font-size: 16px;
  }
  .react-datepicker__day-name,
  .react-datepicker__day {
    font-family: "PretendardR";
    font-size: 12px;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: var(--yellow-color2);
  }
  .react-datepicker__day--holiday {
    position: relative;
  }
  .react-datepicker__day--holiday::after {
    content: "";
    width: 6px;
    height: 6px;
    background-color: red;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    right: 2px;
  }
`;

const TimePickerWrapper = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
`;

const holidays = [
  "2024-01-01",
  "2024-02-09",
  "2024-02-10",
  "2024-02-11",
  "2024-02-12",
  "2024-03-01",
  "2024-04-10",
  "2024-05-05",
  "2024-05-06",
  "2024-05-15",
  "2024-06-06",
  "2024-08-15",
  "2024-09-16",
  "2024-09-17",
  "2024-09-18",
  "2024-10-03",
  "2024-10-09",
  "2024-12-25",
];

// 주어진 날짜가 공휴일인지 확인하는 함수
const isHoliday = (date) => {
  return holidays.includes(format(date, "yyyy-MM-dd"));
};

const Calendar = ({ dogId, userId, ownerId, onClose, onSave }) => {
  const [appointment, setAppointment] = useState({
    user_id: userId,
    owner_id: ownerId,
    dog_id: dogId,
    name: "",
    time: "",
    status: "W",
  });

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [amPm, setAmPm] = useState(
    format(new Date(), "HH") >= 12 ? "오후" : "오전",
  );

  // 날짜 변경 핸들러
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    updateAppointmentTime(selectedDate, time, amPm);
  };

  // 시간 변경 핸들러
  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setTime(selectedTime);
    updateAppointmentTime(date, selectedTime, amPm);
  };

  // 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointment({
      ...appointment,
      [name]: value,
    });
  };

  // 오전/오후 변경 핸들러
  const handleAmPmChange = (e) => {
    const selectedAmPm = e.target.value;
    setAmPm(selectedAmPm);
    updateAppointmentTime(date, time, selectedAmPm);
  };

  // 약속 시간 업데이트
  const updateAppointmentTime = (selectedDate, selectedTime, selectedAmPm) => {
    const [hours, minutes] = selectedTime.split(":");
    let newHours = parseInt(hours);
    if (selectedAmPm === "오후" && newHours < 12) {
      newHours += 12;
    } else if (selectedAmPm === "오전" && newHours >= 12) {
      newHours -= 12;
    }
    const newDate = setHours(setMinutes(selectedDate, minutes), newHours);
    setAppointment((prevAppointment) => ({
      ...prevAppointment,
      time: newDate.toISOString(),
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const kstTime = new Date(appointment.time);
      kstTime.setHours(kstTime.getHours() + 9);

      const formattedTime = kstTime.toISOString();
      const appointmentWithKST = {
        ...appointment,
        time: formattedTime,
      };
      const data = await createAppointment(appointmentWithKST);
      onSave(data);
      console.log("약속 생성:", data);
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }
  };

  // 10분 단위로 시간을 생성하는 함수
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();
  const amPmOptions = ["오전", "오후"];

  return (
    <>
      <Overlay onClick={onClose} />
      <CalendarContainer>
        <Form onSubmit={handleSubmit}>
          <Label>
            약속 이름:
            <Input
              type="text"
              name="name"
              value={appointment.name}
              onChange={handleInputChange}
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
                onChange={(selectedDate) => {
                  handleDateChange(selectedDate);
                }}
                dateFormat="yyyy/MM/dd"
                locale={ko}
                popperPlacement="auto"
                popperModifiers={{
                  preventOverflow: {
                    enabled: true,
                  },
                }}
                renderCustomHeader={({
                  monthDate,
                  // eslint-disable-next-line no-unused-vars
                  customHeaderCount,
                  decreaseMonth,
                  increaseMonth,
                }) => (
                  <div>
                    <button
                      aria-label="Previous Month"
                      className={
                        "react-datepicker__navigation react-datepicker__navigation--previous"
                      }
                      style={{ visibility: "hidden" }}
                      onClick={decreaseMonth}
                    >
                      <span
                        className={
                          "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
                        }
                      >
                        {"<"}
                      </span>
                    </button>
                    <span className="react-datepicker__current-month">
                      {monthDate.toLocaleString("ko", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      aria-label="Next Month"
                      className={
                        "react-datepicker__navigation react-datepicker__navigation--next"
                      }
                      style={{ visibility: "hidden" }}
                      onClick={increaseMonth}
                    >
                      <span
                        className={
                          "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
                        }
                      >
                        {">"}
                      </span>
                    </button>
                  </div>
                )}
                dayClassName={(date) =>
                  isHoliday(date) ? "react-datepicker__day--holiday" : undefined
                }
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
    </>
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
