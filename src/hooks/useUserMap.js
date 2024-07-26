import { useEffect, useRef, useState, useCallback } from "react";
import { getCoordinates } from "../apis/geolocation";
import { getDogInfo } from "../apis/getDogInfo";

const useUserMap = (appKey, initialLocation, dogId, keyword = "", roomId) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [dogMarker, setDogMarker] = useState(null);
  const [selectedDog, setSelectedDog] = useState(null);
  const [positionArr, setPositionArr] = useState([]);
  const infowindow = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [socket, setSocket] = useState(null);

  const makeLine = useCallback(
    (position) => {
      let linePath = position;

      const polyline = new window.kakao.maps.Polyline({
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
    (latitude, longitude) => {
      const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude);
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
          const initialCenter = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
          initializeMap(initialCenter);
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
            level: 8,
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

  useEffect(() => {
    const fetchDogInfo = async () => {
      try {
        const data = await getDogInfo(dogId);
        const dog = data.dog;
        const { latitude, longitude } = await getCoordinates(dog.road_address);
        const markerPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude,
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

    if (map && dogId) {
      fetchDogInfo();
    }
  }, [map, dogId]);

  useEffect(() => {
    if (!map) return;

    const ps = new window.kakao.maps.services.Places();
    if (keyword) {
      ps.keywordSearch(keyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const bounds = new window.kakao.maps.LatLngBounds();
          let newMarkers = [];

          data.forEach((place) => {
            newMarkers.push({
              position: {
                lat: place.y,
                lng: place.x,
              },
              content: place.place_name,
            });
            bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
          });

          setMarkers(newMarkers);
          map.setBounds(bounds);
        }
      });
    }
  }, [map, keyword]);

  useEffect(() => {
    if (map && roomId) {
      const newSocket = new WebSocket(
        `wss://meong-signal.kro.kr/ws/room/${roomId}/locations`,
      );

      newSocket.onopen = () => {
        console.log("WebSocket connected");
        setSocket(newSocket);
      };

      newSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log("Received data from socket:", data);
        if (data.latitude && data.longitude) {
          setLinePathArr(data.latitude, data.longitude);
        }
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      newSocket.onclose = () => {
        console.log("WebSocket closed");
        setSocket(null);
      };

      return () => {
        if (newSocket) {
          newSocket.close();
        }
      };
    }
  }, [map, roomId, setLinePathArr]);

  return { mapContainer, map, selectedDog, setSelectedDog, markers };
};

export default useUserMap;
