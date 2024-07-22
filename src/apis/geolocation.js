// 현재 위치 받아오는 함수(geolocation 기반)

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error),
      );
    } else {
      reject(new Error("브라우저에서 현 위치를 받아오는 데 실패했습니다."));
    }
  });
};
