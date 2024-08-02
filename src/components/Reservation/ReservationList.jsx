import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getUpcomingAppointment } from "../../apis/appointment";
import Reservation from "./Reservation";

const ReservationsContainer = styled.div`
  display: flex;
  width: 300px;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  line-height: 20px;
`;

const NoReservationsMessage = styled.p`
  font-family: "PretendardR";
  font-size: 16px;
  color: #7a7a7a;
  margin-bottom: 10px;
  text-align: center;
  white-space: pre-wrap;
`;

const ReservationList = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const data = await getUpcomingAppointment();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = (id) => {
    setAppointments(
      appointments.filter((appointment) => appointment.id !== id),
    );
  };

  return (
    <ReservationsContainer>
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <Reservation
            key={appointment.id}
            appointment={appointment}
            onCancel={handleCancelAppointment}
          />
        ))
      ) : (
        <NoReservationsMessage>
          현재 예약된 산책 일정이 없습니다.
          <br />
          3일 이내로 예정된 약속만 조회할 수 있어요!
        </NoReservationsMessage>
      )}
    </ReservationsContainer>
  );
};

export default ReservationList;
