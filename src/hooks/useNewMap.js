import { useEffect, useRef, useState, useCallback } from "react";
import { getCoordinates } from "../apis/geolocation";
import { getDogInfo } from "../apis/getDogInfo";

const useNewMap = (appKey, initialLocation, dogId, isBoring = false) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(initialLocation); // 현재 위치
  const [dogMarker, setDogMarker] = useState(null); // 강아지 마커 상태 추가
  const [selectedDog, setSelectedDog] = useState(null); // 선택된 강아지 상태 추가
  // eslint-disable-next-line no-unused-vars
  const [positionArr, setPositionArr] = useState([]); // 위치 배열 상태 추가

  const makeLine = useCallback(
    (position) => {
      let linePath = position;

      var polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: "#FFAE00",
        strokeOpacity: 0.7,
        strokeStyle: "solid",
      });

      // 지도에 선을 표시합니다
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

    const createScript = () => {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services,clusterer,drawing&autoload=false`;
      document.head.appendChild(script);
      script.onload = initializeMap;
      return script;
    };

    const initializeMap = () => {
      window.kakao.maps.load(() => {
        loadKakaoMap();
        if (mapContainer.current) {
          const options = {
            center: new window.kakao.maps.LatLng(
              currentLocation.latitude,
              currentLocation.longitude,
            ),
            level: 7,
          };
          const mapInstance = new window.kakao.maps.Map(
            mapContainer.current,
            options,
          );
          setMap(mapInstance);
        }
      });
    };

    const script = createScript();

    return () => {
      document.head.removeChild(script);
    };
  }, [appKey]);

  useEffect(() => {
    const fetchDogInfo = async () => {
      try {
        const data = await getDogInfo(dogId);
        const dog = data.dog;
        const { latitude, longitude } = await getCoordinates(dog.road_address);
        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);

        const dogMarkerElement = document.createElement("div");
        dogMarkerElement.style.width = "50px";
        dogMarkerElement.style.height = "50px";
        dogMarkerElement.style.backgroundImage = `url(${dog.image})`;
        dogMarkerElement.style.backgroundSize = "cover";
        dogMarkerElement.style.borderRadius = "50%"; // 원형으로 만들기

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: dogMarkerElement,
          map: map,
        });

        setDogMarker(customOverlay);

      } catch (error) {
        console.error("Error fetching dog info:", error);
      }
    };

    if (map) {
      fetchDogInfo();
    }
  }, [map, dogId]);

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

  return { mapContainer, map, currentLocation, selectedDog, setSelectedDog };
};

export default useNewMap;
