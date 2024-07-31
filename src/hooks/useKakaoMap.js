import { useEffect, useRef, useState, useCallback } from "react";
import { getCoordinates } from "../apis/geolocation";
import { getAllDogs } from "../apis/getAllDogs";
import { getBoringDogs } from "../apis/getBoringDogs";

const useKakaoMap = (appKey, initialLocation, isBoring = false) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [marker, setMarker] = useState(null);
  const [dogMarkers, setDogMarkers] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [positionArr, setPositionArr] = useState([]);

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
    script.onload = () => {
      initializeMap();
      script.onload = null; // 스크립트 로드 이벤트 핸들러 제거
    };
    return script;
  };

  const initializeMap = () => {
    if (window.kakao && window.kakao.maps) {
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
    }
  };

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

  useEffect(() => {
    const script = createScript();

    return () => {
      if (script) {
        document.head.removeChild(script);
      }
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
    const fetchDogs = isBoring ? getBoringDogs : getAllDogs;
    const addDogMarkersAndOverlays = async () => {
      try {
        const dogs = await fetchDogs();
        console.log("useKakaoMap에서 받아오는 dogs:", dogs);

        dogMarkers.forEach((dogMarker) => {
          dogMarker.setMap(null);
        });

        const newMarkers = [];
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        for (const dog of dogs) {
          await delay(1000);
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
            { shape: "rect", coords: "0,0,50,50" },
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
              setSelectedDog(dog);
            });

          const overlay = new window.kakao.maps.CustomOverlay({
            content: overlayContent,
            map,
            position: markerPosition,
          });

          window.kakao.maps.event.addListener(dogMarker, "click", () => {
            setSelectedDog(dog);
          });

          window.kakao.maps.event.addListener(dogMarker, "mouseover", () => {
            overlay.setMap(map);
          });

          window.kakao.maps.event.addListener(dogMarker, "mouseout", () => {
            overlay.setMap(null);
          });
        }

        setDogMarkers(newMarkers);
      } catch (error) {
        console.error("Error adding dog markers and overlays:", error);
      }
    };

    if (map) {
      addDogMarkersAndOverlays();
    }
  }, [map, isBoring]);

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

  useEffect(() => {
    if (map) {
      map.relayout();
      const center = new window.kakao.maps.LatLng(
        currentLocation.latitude,
        currentLocation.longitude,
      );
      map.setCenter(center);
    }
  }, [map, isBoring]);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      initializeMap();
    }
  }, [isBoring]);

  return { mapContainer, map, currentLocation, selectedDog, setSelectedDog };
};

export default useKakaoMap;
