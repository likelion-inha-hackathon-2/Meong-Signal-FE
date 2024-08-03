import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Map from "../../components/Map/Map";
import styled from "styled-components";
import { getCoordinates } from "../../apis/geolocation";
import IconLoading from "../../assets/icons/icons-loading.gif";

const LoadingText = styled.p`
  font-family: "PretendardM";
  font-size: 16px;
  margin: 10px;
  white-space: pre-line;
`;

const MapInfo = () => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const coordinates = await getCoordinates();
        setCurrentLocation({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        setLoading(false);
      }
    };

    fetchCoordinates();

    // 로딩 지연 5초 이상 시새로고침
    const timeout = setTimeout(() => {
      if (loading) {
        window.location.reload();
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading) {
    return (
      <>
        <Header />
        <LoadingText>현재 위치를 불러오는 중...</LoadingText>
        <img src={IconLoading} alt="loding" />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Map
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
      />
      <Footer />
    </>
  );
};

export default MapInfo;
