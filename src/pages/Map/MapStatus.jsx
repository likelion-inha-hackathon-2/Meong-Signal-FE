import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // URL 파라미터를 가져오기 위해 추가
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Map from "../../components/Map/Map";
import { getCoordinates } from "../../apis/geolocation";
import SelectRoute from "../../components/Walk/SelectRoute";

const MapStatus = () => {
  const { dogId } = useParams(); // URL 파라미터에서 dogId 가져오기
  const [initialLocation, setInitialLocation] = useState({
    latitude: 37.4482020408321,
    longitude: 126.651415033662,
  }); // 초기 좌표 인하대
  const [currentLocation, setCurrentLocation] = useState(initialLocation);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const coordinates = await getCoordinates(initialLocation);
        setInitialLocation(coordinates);
        setCurrentLocation(coordinates);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, [initialLocation]);

  return (
    <>
      <Header />
      <Map
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
        width="300px"
        height="300px"
      />
      <SelectRoute dog_id={parseInt(dogId, 10)} dog_name="강아지 이름" />
      <Footer />
    </>
  );
};

export default MapStatus;
