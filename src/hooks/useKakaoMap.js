import { useEffect, useRef, useState, useCallback } from "react";
import { getCoordinates } from "../apis/geolocation";
import { getAllDogs } from "../apis/getAllDogs";
import { getBoringDogs } from "../apis/getBoringDogs";

const useKakaoMap = (appKey, initialLocation, isBoring = false) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(initialLocation); // 현재 위치
  const [marker, setMarker] = useState(null);
  const [dogMarkers, setDogMarkers] = useState([]); // 강아지 마커들 상태 추가
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
          createMarker(mapInstance, currentLocation);
        }
      });
    };

    const script = createScript();

    return () => {
      document.head.removeChild(script);
    };
  }, [appKey, currentLocation.latitude, currentLocation.longitude]); // 현재 위치를 종속성 배열에 추가

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
    const fetchDogs = isBoring ? getBoringDogs : getAllDogs;
    const addDogMarkersAndOverlays = async () => {
      try {
        const dogs = await fetchDogs();

        // 기존 마커 제거
        dogMarkers.forEach((dogMarker) => {
          dogMarker.setMap(null);
        });

        const newMarkers = [];

        for (const dog of dogs) {
          const { latitude, longitude } = await getCoordinates(
            dog.road_address,
          );
          const markerPosition = new window.kakao.maps.LatLng(
            latitude,
            longitude,
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
          newMarkers.push(dogMarker);

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
              setSelectedDog(dog); // 강아지 선택
            });

          const overlay = new window.kakao.maps.CustomOverlay({
            content: overlayContent,
            map,
            position: markerPosition,
          });

          window.kakao.maps.event.addListener(dogMarker, "click", () => {
            setSelectedDog(dog); // 강아지 선택
          });

          window.kakao.maps.event.addListener(dogMarker, "mouseover", () => {
            overlay.setMap(map);
          });

          window.kakao.maps.event.addListener(dogMarker, "mouseout", () => {
            overlay.setMap(null);
          });
        }

        // 새로운 마커들 상태 업데이트
        setDogMarkers(newMarkers);
      } catch (error) {
        console.error("Error adding dog markers and overlays:", error);
      }
    };

    if (map) {
      addDogMarkersAndOverlays();
    }
  }, [map, isBoring, dogMarkers]);

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

  const createMarker = (mapInstance, location) => {
    const markerPosition = new window.kakao.maps.LatLng(
      location.latitude,
      location.longitude,
    );
    const markerImage = new window.kakao.maps.MarkerImage(
      "https://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png",
      new window.kakao.maps.Size(30, 40),
    );
    const markerInstance = new window.kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
    });
    markerInstance.setMap(mapInstance);
    setMarker(markerInstance);
  };

  return { mapContainer, map, currentLocation, selectedDog, setSelectedDog };
};

export default useKakaoMap;
