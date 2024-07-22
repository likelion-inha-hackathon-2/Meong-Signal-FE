import { useEffect, useRef, useState } from "react";
import { getCoordinates } from "../apis/geolocation";
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

          // 현재 위치를 나타내는 마커, 카카오에서 가져옴
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
            dog.image,
            new window.kakao.maps.Size(20, 20),
          );

          const dogMarker = new window.kakao.maps.Marker({
            position: markerPosition,
            image: dogMarkerImage,
          });

          dogMarker.setMap(map);

          // 커스텀 오버레이를 사용한 강아지 마커(html 문법으로 써야 함)
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
              window.location.href = `/dog/${dog.id}`;
            });

          const overlay = new window.kakao.maps.CustomOverlay({
            content: overlayContent,
            map,
            position: markerPosition,
          });

          window.kakao.maps.event.addListener(dogMarker, "click", () => {
            // 해당하는 dog_id를 가진 새 페이지로 이동! 아직 미구현..
            window.location.href = `/dog/${dog.id}`;
          });

          window.kakao.maps.event.addListener(dogMarker, "mouseover", () => {
            overlay.setMap(map);
          });

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
