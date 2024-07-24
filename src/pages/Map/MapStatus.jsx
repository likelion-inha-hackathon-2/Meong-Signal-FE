import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // URL 파라미터를 가져오기 위해 추가
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Map from "../../components/Map/Map";
import SelectRoute from "../../components/Walk/SelectRoute";
import { getDogInfo } from "../../apis/getDogInfo";
import { getCoordinates } from "../../apis/geolocation";

const MapStatus = () => {
  const { dogId } = useParams(); // URL 파라미터에서 dogId 가져오기
  const [initialLocation, setInitialLocation] = useState({
    latitude: 37.4482020408321,
    longitude: 126.651415033662,
  }); // 초기 좌표 인하대
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [dogName, setDogName] = useState(""); // 강아지 이름 상태 추가

  useEffect(() => {
    const fetchDogInfo = async () => {
      try {
        const data = await getDogInfo(dogId);
        setDogName(data.dog.name); // 강아지 이름은 제대로 받아옴
      } catch (error) {
        console.error("Error fetching dog info:", error);
      }
    };

    fetchDogInfo();
  }, [dogId]);

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

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <>
      <Header />
      <Map
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
        width="300px"
        height="300px"
      />
      <SelectRoute dog_id={parseInt(dogId, 10)} dog_name={dogName} /> <Footer />
    </>
  );
};

export default MapStatus;
