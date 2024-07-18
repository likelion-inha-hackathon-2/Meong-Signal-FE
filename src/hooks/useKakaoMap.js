import { useEffect, useRef, useState } from "react";

const useKakaoMap = (appKey, initialLocation) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(initialLocation); // 현재 위치
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services,clusterer,drawing&autoload=false`;
    document.head.appendChild(script);

    // 초기 위치는 현재 위치로 설정
    script.onload = () => {
      window.kakao.maps.load(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
          });
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [appKey]);

  // 현재 위치가 변해도 동적으로 변경되게 구현
  useEffect(() => {
    if (mapContainer.current && window.kakao && window.kakao.maps) {
      const options = {
        // 중심 위치를 현재 위치의 위도,경도로 받아오기
        center: new window.kakao.maps.LatLng(
          currentLocation.latitude,
          currentLocation.longitude,
        ),
        level: 5, // 일단 레벨 5로 설정
      };

      const map = new window.kakao.maps.Map(mapContainer.current, options);
      setMap(map);

      // 마커 현재 위치에 만들기
      const markerPosition = new window.kakao.maps.LatLng(
        currentLocation.latitude,
        currentLocation.longitude,
      );

      // 카카오 기본 마커 사용 (출처: https://apis.map.kakao.com/web/documentation/#Marker)
      const imageSrc = "https://i1.daumcdn.net/dmaps/apis/n_local_blit_04.png";
      const imageSize = new window.kakao.maps.Size(31, 35);
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
      );

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });

      marker.setMap(map);
      setMarker(marker);
    }
  }, [currentLocation]); // 의존성 배열에 추가

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

  return { mapContainer, map, currentLocation };
};

export default useKakaoMap;
