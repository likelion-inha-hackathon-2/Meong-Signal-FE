// 현재 위치 받아오는 함수

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

// 현재 위치를 보내서 위도, 경도로 변환
export const getCoordinates = async () => {
  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position;

    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};
