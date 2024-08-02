import { useEffect, useRef, useState, useCallback } from "react";
import { getCoordinates } from "../apis/geolocation";
import { getDogInfo } from "../apis/getDogInfo";

const useUserMap = (appKey, dogId, keyword = "") => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [dogMarker, setDogMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const infowindow = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [positionArr, setPositionArr] = useState([]);

  const makeLine = useCallback(
    (position) => {
      let linePath = position;

      var polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: "#FF0000",
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
    const loadKakaoMap = async () => {
      try {
        const initialCenter = await getCoordinates();
        setCurrentLocation(initialCenter);
        initializeMap(initialCenter);
      } catch (error) {
        console.error("현재 위치를 불러오는 데 실패했습니다.", error);
      }
    };

    const createScript = () => {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services,clusterer,drawing&autoload=false`;
      document.head.appendChild(script);
      script.onload = loadKakaoMap;
      return script;
    };

    const initializeMap = (center) => {
      window.kakao.maps.load(() => {
        if (mapContainer.current) {
          const options = {
            center: new window.kakao.maps.LatLng(
              center.latitude,
              center.longitude,
            ),
            level: 7,
          };
          const mapInstance = new window.kakao.maps.Map(
            mapContainer.current,
            options,
          );
          setMap(mapInstance);
          infowindow.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        }
      });
    };

    const script = createScript();

    return () => {
      document.head.removeChild(script);
    };
  }, [appKey]);

  const updateDogMarker = (position) => {
    if (dogMarker) {
      dogMarker.setMap(null); // 이전 마커 제거
    }

    const markerPosition = new window.kakao.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude,
    );

    const dogMarkerElement = document.createElement("div");
    dogMarkerElement.style.width = "50px";
    dogMarkerElement.style.height = "50px";
    dogMarkerElement.style.backgroundImage = `url`;
    dogMarkerElement.style.backgroundSize = "cover";
    dogMarkerElement.style.borderRadius = "50%";

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: markerPosition,
      content: dogMarkerElement,
      map: map,
    });

    setDogMarker(customOverlay);
  };

  useEffect(() => {
    const fetchDogInfo = async () => {
      try {
        const data = await getDogInfo(dogId);
        const dog = data.dog;
        const markerPosition = new window.kakao.maps.LatLng(
          currentLocation.latitude,
          currentLocation.longitude,
        );

        const dogMarkerElement = document.createElement("div");
        dogMarkerElement.style.width = "50px";
        dogMarkerElement.style.height = "50px";
        dogMarkerElement.style.backgroundImage = `url(${dog.image})`;
        dogMarkerElement.style.backgroundSize = "cover";
        dogMarkerElement.style.borderRadius = "50%";

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

    if (map && dogId && currentLocation) {
      fetchDogInfo();
    }
  }, [map, dogId, currentLocation]);

  useEffect(() => {
    if (!map) return;

    const ps = new window.kakao.maps.services.Places();
    if (keyword) {
      ps.keywordSearch(keyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const bounds = new window.kakao.maps.LatLngBounds();
          let newMarkers = [];

          data.forEach((place) => {
            const markerPosition = new window.kakao.maps.LatLng(
              place.y,
              place.x,
            );
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
              map: map,
            });
            newMarkers.push(marker);
            bounds.extend(markerPosition);

            window.kakao.maps.event.addListener(marker, "click", () => {
              infowindow.current.setContent(
                `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
              );
              infowindow.current.open(map, marker);
            });
          });

          setMarkers(newMarkers);
          map.setBounds(bounds);
          map.setLevel(7);
        }
      });
    }
  }, [map, keyword]);

  useEffect(() => {
    if (map) {
      const interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          setLinePathArr(position);
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          updateDogMarker(position); // 강아지 마커 업데이트
        });
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [map, setLinePathArr]);

  return { mapContainer, map, currentLocation, setCurrentLocation };
};

export default useUserMap;
