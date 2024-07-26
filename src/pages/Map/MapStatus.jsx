import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Map from "../../components/Map/Map";
import { getCoordinates } from "../../apis/geolocation";

const MapStatus = () => {
  const [initialLocation, setInitialLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [currentLocation, setCurrentLocation] = useState(initialLocation);

  useEffect(() => {
    const fetchInitialCoordinates = async () => {
      try {
        const coordinates = await getCoordinates();
        setInitialLocation(coordinates);
        setCurrentLocation(coordinates);
      } catch (error) {
        console.error("Error fetching initial coordinates:", error);
      }
    };

    fetchInitialCoordinates();
  }, []);

  return (
    <>
      <Header />
      <p>내 강아지가 산책 중 상태라면</p>
      산책 중인 유저 정보와 강아지 위치 조회
      <Map
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
        width="300px"
        height="300px"
      />
      <Footer />
    </>
  );
};

export default MapStatus;
