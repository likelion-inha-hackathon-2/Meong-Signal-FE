import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Map from "../../components/Map/Map";
import { getCurrentPosition } from "../../apis/geolocation";

const MapInfo = () => {
  const [initialLocation, setInitialLocation] = useState({
    // 초기 위치 인하대. 어차피 현 위치로 바뀜!
    latitude: 37.4482020408321,
    longitude: 126.651415033662,
  });

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const coordinates = await getCurrentPosition();
        setInitialLocation({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, [initialLocation]); // 의존성 배열..

  return (
    <>
      <Header />
      <Map
        latitude={initialLocation.latitude}
        longitude={initialLocation.longitude}
      />
      <Footer />
    </>
  );
};

export default MapInfo;
