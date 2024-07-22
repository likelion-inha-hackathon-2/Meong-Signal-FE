import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Trail from "../../components/Trail/Trail";
import authApi from "../../apis/authApi";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const WalkDetailContainer = styled.div`
  padding: 0;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const TrailList = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
`;

const WalkDetail = () => {
  const [currentLocation, setCurrentLocation] = useState(null); // 초기값 null로 설정
  const [recommendedTrails, setRecommendedTrails] = useState([]);

  useEffect(() => {
    const fetchCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
          },
          (error) => {
            console.error("Error fetching location:", error);
          }
        );
      }
    };

    fetchCurrentLocation();
  }, []); // 컴포넌트가 마운트될 때만 실행

  useEffect(() => {
    if (!currentLocation) return;

    const fetchRecommendedTrails = async () => {
      try {
        console.log("Sending POST request to /walks/recommended-trails");
        console.log("Current Location:", currentLocation);

        const response = await authApi.post("/walks/recommended-trails", currentLocation);

        if (response.status === 201) {
          const data = response.data;
          console.log("Received data:", data);
          setRecommendedTrails(data.recommend_trails);
        } else {
          console.error("Failed to fetch recommended trails", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching recommended trails:", error);
      }
    };

    fetchRecommendedTrails();
  }, [currentLocation]); // currentLocation이 변경될 때만 실행

  return (
    <>
      <Header />
      <WalkDetailContainer>
        <SectionTitle>산책로 추천</SectionTitle>
        <TrailList>
          {recommendedTrails.map((trail, index) => (
            <Trail
              key={index} // trail.id가 없는 경우 index 사용
              name={trail.name}
              level={trail.level}
              distance={trail.distance}
              total_time={trail.total_time}
            />
          ))}
        </TrailList>
      </WalkDetailContainer>
      <Footer />
    </>
  );
};

export default WalkDetail;




