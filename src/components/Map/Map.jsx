import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useKakaoMap from "../../hooks/useKakaoMap";

const StyledMap = styled.div`
  width: ${(props) => props.width || "375px"}; // 아이폰 se 기준
  height: ${(props) =>
    props.height ||
    "555px"}; // 기본 높이 (아이폰 se에서 헤더와 푸터 높이를 빼기)
  flex-shrink: 0;
`;

const Map = ({ latitude, longitude, width, height }) => {
  const initialLocation = { latitude, longitude };
  const { mapContainer } = useKakaoMap(
    process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY,
    initialLocation,
  );

  return (
    <StyledMap ref={mapContainer} width={width} height={height}></StyledMap>
  );
};

// eslint props 에러 안뜨게 수정
Map.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default Map;
