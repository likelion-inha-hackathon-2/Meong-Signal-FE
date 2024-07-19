import { useEffect, useRef, useState } from "react";
import { getCoordinates } from "../apis/kakaoApi";
import { getBoringDogs } from "../apis/getBoringDogs";

const useKakaoMap = (appKey, initialLocation) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(initialLocation); // 현재 위치
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          setCurrentLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        });
      } else {
        console.error("현재 브라우저에서는 현 위치를 불러올 수 없어요.");
      }
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services,clusterer,drawing&autoload=false`;
    document.head.appendChild(script);
    script.onload = () => {
      window.kakao.maps.load(() => {
        loadKakaoMap();
        if (mapContainer.current) {
          const options = {
            center: new window.kakao.maps.LatLng(
              currentLocation.latitude,
              currentLocation.longitude,
            ),
            level: 6,
          };
          const mapInstance = new window.kakao.maps.Map(
            mapContainer.current,
            options,
          );
          setMap(mapInstance);

          const markerPosition = new window.kakao.maps.LatLng(
            currentLocation.latitude,
            currentLocation.longitude,
          );
          const markerImage = new window.kakao.maps.MarkerImage(
            "https://i1.daumcdn.net/dmaps/apis/n_local_blit_04.png",
            new window.kakao.maps.Size(31, 35),
          );

          const markerInstance = new window.kakao.maps.Marker({
            position: markerPosition,
            image: markerImage,
          });

          markerInstance.setMap(mapInstance);
          setMarker(markerInstance);
        }
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [appKey, currentLocation.latitude, currentLocation.longitude]);

  useEffect(() => {
    if (marker && map) {
      const markerPosition = new window.kakao.maps.LatLng(
        currentLocation.latitude,
        currentLocation.longitude,
      );
      marker.setPosition(markerPosition);
      map.setCenter(markerPosition);
    }
  }, [currentLocation, marker, map]);

  useEffect(() => {
    const addDogMarkersAndOverlays = async (dogs) => {
      for (const dog of dogs) {
        try {
          const { latitude, longitude } = await getCoordinates(
            dog.road_address,
          );
          const markerPosition = new window.kakao.maps.LatLng(
            latitude,
            longitude,
          );
          const dogMarkerImage = new window.kakao.maps.MarkerImage(
            dog.image, // 강아지 이미지 URL
            new window.kakao.maps.Size(31, 35),
          );

          const dogMarker = new window.kakao.maps.Marker({
            position: markerPosition,
            image: dogMarkerImage,
          });

          dogMarker.setMap(map);

          const content = `
            <div style="padding:5px;">
              <img src="${dog.image}" style="width:50px;height:50px;" alt="${dog.name}">
              <div>${dog.name}</div>
              <div>${dog.distance} km</div>
            </div>
          `;

          const overlay = new window.kakao.maps.CustomOverlay({
            content,
            map,
            position: markerPosition,
          });

          // 마커에 클릭 이벤트 추가
          window.kakao.maps.event.addListener(dogMarker, "click", () => {
            window.location.href = `/dog/${dog.id}`;
          });

          // 마커에 마우스 오버 이벤트 추가 (오버레이 표시)
          window.kakao.maps.event.addListener(dogMarker, "mouseover", () => {
            overlay.setMap(map);
          });

          // 마커에 마우스 아웃 이벤트 추가 (오버레이 숨김)
          window.kakao.maps.event.addListener(dogMarker, "mouseout", () => {
            overlay.setMap(null);
          });
        } catch (error) {
          console.error("Error adding dog marker and overlay:", error);
        }
      }
    };

    getBoringDogs().then(addDogMarkersAndOverlays).catch(console.error);
  }, [map]);

  return { mapContainer, map, currentLocation };
};

export default useKakaoMap;
