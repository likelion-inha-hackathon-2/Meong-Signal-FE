import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useKakaoMap from "../../hooks/useKakaoMap";
import ToggleButton from "../Button/ToggleButton";
import MapStatusButton from "../Button/MapStatusButton";
import { useNavigate, useLocation } from "react-router-dom";
import TagFilteringButton from "../Button/TagFilteringButton";
import { getAllDogs } from "../../apis/getAllDogs"; // 기본 상태는 모든 강아지를 보여줌
import { getBoringDogs } from "../../apis/getBoringDogs"; // 심심한 강아지 목록 가져오기
import DogMoreInfo from "../Dog/DogMoreInfo";

const StyledMap = styled.div`
  width: ${(props) => props.width || "375px"}; // 아이폰 se 기준
  height: ${(props) =>
    props.height ||
    "555px"}; // 기본 높이 (아이폰 se에서 헤더와 푸터 높이를 빼기)
  flex-shrink: 0;
`;

const Map = ({ latitude, longitude, width, height }) => {
  const initialLocation = { latitude, longitude };
  const { mapContainer, map } = useKakaoMap(
    process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY,
    initialLocation,
  );

  const navigate = useNavigate();
  const location = useLocation();
  const [dogs, setDogs] = useState([]);
  const [selectedDogId, setSelectedDogId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllDogs();
        setDogs(data);
      } catch (error) {
        console.error("Error fetching initial dogs data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (location.pathname === "/map-info") {
      // 기존 마커 및 오버레이 제거
      map && map.setLevel(map.getLevel());

      // 새로운 강아지 목록을 커스텀 오버레이로 표시
      dogs.forEach((dog) => {
        const markerPosition = new window.kakao.maps.LatLng(
          dog.latitude,
          dog.longitude,
        );
        const dogMarkerImage = new window.kakao.maps.MarkerImage(
          dog.image,
          new window.kakao.maps.Size(20, 20),
        );

        const dogMarker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: dogMarkerImage,
        });

        dogMarker.setMap(map);

        // 커스텀 오버레이를 사용한 강아지 마커
        const overlayContent = document.createElement("div");
        overlayContent.innerHTML = `
          <div id="overlay-${dog.id}" style="display: flex; align-items: center; justify-content: center; padding: 4px; background-color: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); cursor: pointer; font-family: 'PretendardR';" >
            <img src="${dog.image}" style="width: 60px; height: 60px; border-radius: 50%;" alt="${dog.name}">
            <div >
              <div style="font-weight: bold;">${dog.name}</div>
              <div style="color: black;">${dog.distance}km</div>
            </div>
          </div>
        `;
        overlayContent
          .querySelector(`#overlay-${dog.id}`)
          .addEventListener("click", () => {
            setSelectedDogId(dog.id);
          });

        const overlay = new window.kakao.maps.CustomOverlay({
          content: overlayContent,
          map,
          position: markerPosition,
        });

        window.kakao.maps.event.addListener(dogMarker, "mouseover", () => {
          overlay.setMap(map);
        });

        window.kakao.maps.event.addListener(dogMarker, "mouseout", () => {
          overlay.setMap(null);
        });
      });
    }
  }, [dogs, location.pathname, map]);

  const handleToggle = async (isBoring) => {
    try {
      const data = isBoring ? await getBoringDogs() : await getAllDogs();
      setDogs(data);
    } catch (error) {
      console.error("Error fetching dogs data:", error);
    }
  };

  const onClickMapStatus = () => {
    navigate("/map-status");
  };

  const onClickTageFilteringIcon = () => {
    navigate("/map-tag");
  };

  return (
    <StyledMap ref={mapContainer} width={width} height={height}>
      <ToggleButton onToggle={handleToggle} />
      <MapStatusButton onClick={onClickMapStatus} />
      {location.pathname === "/map-info" && (
        <>
          <TagFilteringButton onClick={onClickTageFilteringIcon} />
          {selectedDogId && (
            <DogMoreInfo
              dogId={selectedDogId}
              onClose={() => setSelectedDogId(null)}
            />
          )}
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
