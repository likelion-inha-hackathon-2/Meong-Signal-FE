import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getUpcomingAppointment } from "../../apis/appointment";
import Reservation from "./Reservation";

const ReservationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ReservationList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getUpcomingAppointment();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <ReservationsContainer>
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <Reservation key={appointment.id} appointment={appointment} />
        ))
      ) : (
        <p>예약이 없습니다.</p>
      )}
    </ReservationsContainer>
  );
};

export default ReservationList;
