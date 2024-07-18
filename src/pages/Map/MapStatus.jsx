import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Map from "../../components/Map/Map";
import useKakaoMap from "../../hooks/useKakaoMap";

const MapStatus = () => {
  const initialLocation = {
    latitude: 37.4482020408321,
    longitude: 126.651415033662,
  }; // 초기 좌표 인하대
  const { currentLocation } = useKakaoMap(
    process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY,
    initialLocation,
  );

  return (
    <>
      <Header />
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
