import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useKakaoMap from "../../hooks/useKakaoMap";
import ToggleButton from "../Button/ToggleButton";
import MapInfoButton from "../Button/MapInfoButton";
import { useNavigate, useLocation } from "react-router-dom";
import DogMoreInfo from "../Dog/DogMoreInfo";
import IconTagFiltering from "../../assets/icons/icon-tag-filtering.png";
import "react-tooltip/dist/react-tooltip.css"; // ReactTooltip CSS import

const StyledMap = styled.div`
  position: relative;
  width: ${(props) => props.width || "375px"};
  height: ${(props) => props.height || "555px"};
  flex-shrink: 0;
`;

const StyledTagFilteringIcon = styled.div`
  width: 31px;
  height: 32px;
  position: absolute;
  right: 15px;
  bottom: 20px;
  z-index: 100;
  cursor: pointer;
  background-image: url(${IconTagFiltering});
  background-size: cover;
`;

const Map = ({ latitude, longitude, width, height }) => {
  const initialLocation = { latitude, longitude };
  const [isBoring, setIsBoring] = useState(false);
  const { mapContainer, map, selectedDog, setSelectedDog } = useKakaoMap(
    process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY,
    initialLocation,
    isBoring,
  );

  const [positionArr, setPositionArr] = useState([]); // 위치 배열

  const navigate = useNavigate();
  const location = useLocation();
  const [isMapInfo, setIsMapInfo] = useState(location.pathname === "/map-info");

  const handleToggle = (newToggled) => {
    setIsBoring(newToggled);
  };

  const onClickTagFilteringIcon = () => {
    navigate("/map-tag");
  };

  const handleMapInfoClick = () => {
    setIsMapInfo(!isMapInfo);
  };

  const handleCloseTooltip = () => {
    setSelectedDog(null);
  };

  // 라인을 그리는 함수
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

      // 지도에 선을 표시합니다
      polyline.setMap(map);
    },
    [map],
  );

  // 라인을 그리기 위한 좌표 배열을 만들어주는 함수
  const setLinePathArr = useCallback(
    (position) => {
      const moveLatLon = new window.kakao.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude,
      );
      const newPosition = positionArr.concat(moveLatLon);
      setPositionArr(newPosition);

      // 라인을 그리는 함수
      makeLine(newPosition);
    },
    [positionArr, makeLine],
  );

  useEffect(() => {
    // map이 변경될 시 확인하고 map이 존재하면 5초마다 현재 위치를 가져오는 함수를 실행
    if (map) {
      let interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(setLinePathArr);
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [map, setLinePathArr]);

  return (
    <StyledMap ref={mapContainer} width={width} height={height}>
      <ToggleButton onToggle={handleToggle} />
      <MapInfoButton isMapInfo={isMapInfo} onClick={handleMapInfoClick} />
      <StyledTagFilteringIcon onClick={onClickTagFilteringIcon} />
      {selectedDog && (
        <>
          <DogMoreInfo dogId={selectedDog.id} onClose={handleCloseTooltip} />
        </>
      )}
    </StyledMap>
  );
};

Map.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default Map;
