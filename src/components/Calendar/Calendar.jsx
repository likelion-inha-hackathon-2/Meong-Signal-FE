import React, { useState } from "react";
import styled from "styled-components";
import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../calendarStyles.css";

// 2024년 한국 공휴일 리스트
const holidays2024 = [
  new Date(2024, 0, 1), // 1/1
  new Date(2024, 1, 9), // 2/9
  new Date(2024, 1, 10), // 2/10
  new Date(2024, 1, 11), // 2/11
  new Date(2024, 1, 12), // 2/12
  new Date(2024, 2, 1), // 3/1
  new Date(2024, 3, 10), // 4/10
  new Date(2024, 4, 5), // 5/5
  new Date(2024, 4, 6), // 5/6
  new Date(2024, 4, 15), // 5/15
  new Date(2024, 5, 6), // 6/6
  new Date(2024, 7, 15), // 8/15
  new Date(2024, 8, 16), // 9/16
  new Date(2024, 8, 17), // 9/17
  new Date(2024, 8, 18), // 9/18
  new Date(2024, 9, 3), // 10/3
  new Date(2024, 9, 9), // 10/9
  new Date(2024, 11, 25), // 12/25
];

const TooltipContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: 300px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 200;
  font-family: "PretendardM";
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: var(--yellow-color2);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "PretendardM";
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #6BBE6F;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  margin: 5px 0;
`;

const EditButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #f0ad4e;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  margin: 5px 0;
`;

const RejectButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #d9534f;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  margin: 5px 0;
`;

const Calendar = ({ onClose, onSave }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentName, setAppointmentName] = useState("");
  const [showButtons, setShowButtons] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleNameChange = (event) => {
    setAppointmentName(event.target.value);
  };

  const handleSave = () => {
    setShowButtons(true);
  };

  const handleConfirm = () => {
    console.log("약속 이름:", appointmentName);
    console.log("약속 날짜:", selectedDate);
    console.log("약속 시간:", selectedTime);
    onSave(appointmentName, selectedDate, selectedTime);
    onClose();
  };

  const handleEdit = () => {
    setShowButtons(false);
  };

  const handleReject = () => {
    alert("약속이 거절되었습니다.");
    onClose();
  };

  const dayClassName = (date) => {
    const isHoliday = holidays2024.some(
      (holiday) => holiday.toDateString() === date.toDateString()
    );
    return isHoliday ? "holiday-dot" : undefined;
  };

  return (
    <TooltipContainer>
      {!showButtons && (
        <>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            locale={ko}
            inline
            highlightDates={holidays2024}
            dayClassName={dayClassName}
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div
                style={{
                  backgroundColor: "#FFE8AD",
                  padding: "10px",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                <button
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  style={{ backgroundColor: "#FFE8AD", border: "none" }}
                >
                  {"<"}
                </button>
                <select
                  value={date.getFullYear()}
                  onChange={({ target: { value } }) => changeYear(value)}
                  style={{ backgroundColor: "#FFE8AD", border: "none" }}
                >
                  {Array.from(
                    { length: 100 },
                    (_, i) => new Date().getFullYear() - 50 + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={date.getMonth()}
                  onChange={({ target: { value } }) => changeMonth(value)}
                  style={{ backgroundColor: "#FFE8AD", border: "none" }}
                >
                  {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                    <option key={month} value={month}>
                      {new Intl.DateTimeFormat(ko, { month: "long" }).format(
                        new Date(date.getFullYear(), month)
                      )}
                    </option>
                  ))}
                </select>
                <button
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  style={{ backgroundColor: "#FFE8AD", border: "none" }}
                >
                  {">"}
                </button>
              </div>
            )}
          />
          <Dropdown value={selectedTime} onChange={handleTimeChange}>
            {Array.from({ length: 144 }, (_, i) => {
              const hours = String(Math.floor(i / 6)).padStart(2, "0");
              const minutes = String((i % 6) * 10).padStart(2, "0");
              return (
                <option key={i} value={`${hours}:${minutes}`}>
                  {`${hours}:${minutes}`}
                </option>
              );
            })}
          </Dropdown>
          <Input
            type="text"
            value={appointmentName}
            onChange={handleNameChange}
            placeholder="약속 이름을 입력하세요"
          />
          <SaveButton onClick={handleSave}>저장</SaveButton>
        </>
      )}
      {showButtons && (
        <>
          <ConfirmButton onClick={handleConfirm}>수락</ConfirmButton>
          <EditButton onClick={handleEdit}>수정</EditButton>
          <RejectButton onClick={handleReject}>거절</RejectButton>
        </>
      )}
    </TooltipContainer>
  );
};

export default Calendar;
