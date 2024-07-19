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
            level: 5,
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
          const dogMarker = new window.kakao.maps.Marker({
            position: markerPosition,
            image: new window.kakao.maps.MarkerImage(
              dog.image,
              new window.kakao.maps.Size(31, 35),
            ),
          });

          dogMarker.setMap(map);

          const content = `
            <div style="padding:5px;">
              <img src="${dog.image}" style="width:30px;height:30px;" alt="${dog.name}">
              <div>${dog.name}</div>
              <div>${dog.distance} km</div>
            </div>
          `;

          new window.kakao.maps.CustomOverlay({
            content,
            map,
            position: markerPosition,
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
