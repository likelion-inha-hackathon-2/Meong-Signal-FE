import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Map from "../../components/Map/Map";
import { getCoordinates } from "../../apis/geolocation";

const MapInfo = () => {
  const [currentLocation, setCurrentLocation] = useState({
    // 초기 위치 지정 안함
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const coordinates = await getCoordinates();
        setCurrentLocation({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, []);

  if (currentLocation.latitude === null || currentLocation.longitude === null) {
    return <div>Loading...</div>; // 위치 정보가 로드될 때까지 로딩 표시
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
