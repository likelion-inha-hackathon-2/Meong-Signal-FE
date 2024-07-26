import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useUserMap from "../../hooks/useUserMap";
import DogMoreInfo from "../Dog/DogMoreInfo";
import { useLocation } from "react-router-dom";

const StyledMap = styled.div`
  position: relative;
  width: ${(props) => props.width || "375px"};
  height: ${(props) => props.height || "555px"};
  flex-shrink: 0;
`;

const MapUser = ({ latitude, longitude, width, height }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const dogId = query.get("dogId");
  const keyword = query.get("keyword");

  const initialLocation = { latitude, longitude };
  // eslint-disable-next-line no-unused-vars
  const { mapContainer, map, selectedDog, setSelectedDog, markers } =
    useUserMap(
      process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY,
      initialLocation,
      dogId,
      keyword,
    );

  // eslint-disable-next-line no-unused-vars
  const [positionArr, setPositionArr] = useState([]);

  const handleCloseTooltip = useCallback(() => {
    setSelectedDog(null);
  }, [setSelectedDog]);

  const makeLine = useCallback(
    (position) => {
      let linePath = position;

      var polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: "#ff0000",
        strokeOpacity: 0.7,
        strokeStyle: "solid",
      });

      polyline.setMap(map);
    },
    [map],
  );

  const setLinePathArr = useCallback(
    (position) => {
      const moveLatLon = new window.kakao.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude,
      );
      setPositionArr((prevArr) => {
        const newPosition = [...prevArr, moveLatLon];
        makeLine(newPosition);
        return newPosition;
      });
    },
    [makeLine],
  );

  useEffect(() => {
    if (map) {
      const interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(setLinePathArr);
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [map, setLinePathArr]);

  return (
    <StyledMap ref={mapContainer} width={width} height={height}>
      {selectedDog && (
        <DogMoreInfo dogId={selectedDog.id} onClose={handleCloseTooltip} />
      )}
    </StyledMap>
  );
};

MapUser.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default MapUser;
