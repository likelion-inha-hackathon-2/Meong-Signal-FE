import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getMarkedTrails } from "../../apis/trail";
import { saveWalkData } from "../../apis/walk";
import { updateDogStatus } from "../../apis/updateDogStatus";
import { getDistance } from "../../utils/getDistance";

const SelectRoute = ({ dog_id, dog_name }) => {
  const [status, setStatus] = useState("start"); // 초기 상태를 'start'로 설정
  const [routes, setRoutes] = useState([]);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [watchId, setWatchId] = useState(null);
  const [meong] = useState(100); // 기본값 설정
  const [previousPosition, setPreviousPosition] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    if (status === "walking") {
      startTracking();
    } else {
      stopTracking();
    }
  }, [status]);

  const startTracking = () => {
    const startTime = Date.now();
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 60000; // 분 단위로 계산
        setTime(elapsedTime.toFixed(2));

        const { latitude, longitude } = position.coords;
        const currentPos = { latitude, longitude };

        if (previousPosition) {
          const newDistance = getDistance(previousPosition, currentPos);
          setDistance((prevDistance) =>
            (prevDistance + newDistance).toFixed(2),
          );
        }

        setPreviousPosition(currentPos);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true },
    );
    setWatchId(watchId);
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  const handleStartWalk = (route = null) => {
    setSelectedRoute(route);
    alert("산책을 시작합니다!");
    setStatus("walking");
    updateDogStatus(dog_id, "W"); // 상태 업데이트
  };

  const handleEndWalk = () => {
    stopTracking();
    setStatus("end");
    updateDogStatus(dog_id, "B"); // 상태 업데이트
    postWalkData(); // 산책 데이터 전송
  };

  const postWalkData = () => {
    saveWalkData({
      walk: {
        dog_id,
        time: parseFloat(time),
        meong,
        distance: parseFloat(distance),
      },
    })
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
  };

  const fetchRoutes = () => {
    getMarkedTrails()
      .then((data) => setRoutes(data))
      .catch((error) => console.error("Error fetching marked trails:", error));
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div>
      {status === "start" && (
        <div>
          <h1>현재 위치에서 {dog_name}와의 산책을 시작합니다.</h1>
          <p>경로를 지정하시겠습니까?</p>
          <button onClick={() => setStatus("selecting")}>예</button>
          <button onClick={() => handleStartWalk()}>아니오</button>
        </div>
      )}
      {status === "selecting" && (
        <div>
          <h1>산책로 선택</h1>
          {routes.map((route, index) => (
            <div key={index} onClick={() => handleStartWalk(route)}>
              {route.name}
            </div>
          ))}
        </div>
      )}
      {status === "walking" && (
        <div>
          <h1>
            {selectedRoute
              ? `${selectedRoute.name}을 목표 지점으로 산책을 시작합니다!`
              : "산책을 시작합니다!"}
          </h1>
          <p>시간: {time} 분</p>
          <p>거리: {distance} km</p>
          <button onClick={handleEndWalk}>산책 종료</button>
        </div>
      )}
      {status === "end" && (
        <div>
          <h1>산책 완료</h1>
          <p>총 시간: {time} 분</p>
          <p>총 거리: {distance} km</p>
        </div>
      )}
    </div>
  );
};

SelectRoute.propTypes = {
  dog_id: PropTypes.number.isRequired,
  dog_name: PropTypes.string.isRequired,
};

export default SelectRoute;
