import React, { useState } from "react";
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
  const { mapContainer, selectedDog, setSelectedDog } = useKakaoMap(
    process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY,
    initialLocation,
    isBoring,
  );

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
