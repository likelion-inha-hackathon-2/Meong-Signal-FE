import authApi from "./authApi";

// 산책중인 내 강아지와 산책자의 정보 조회
export const getMyWalkingDogInfo = async () => {
  try {
    const response = await authApi.get("/schedule/walking-dogs");
    return response.data;
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};

// 내 정보에서 산책 기록을 조회
export const getWalksRecord = async () => {
  try {
    const response = await authApi.get("/walks/all");
    return response.data;
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};

// 산책 완료 시 기록 저장
export const saveWalkData = async (formData) => {
  try {
    const response = await authApi.post("/walks/new", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving walk data:", error);
    throw error;
  }
};

// 산책 후 리뷰를 위한 사용자 정보 조회
export const getUserImageAndName = async (walkId) => {
  try {
    const response = await authApi.post(`/walks/user-image`, {
      walk_id: walkId,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user image and name:", error);
    throw error;
  }
};

// 산책 정보와 그에 달린 리뷰 조회
export const getWalkReviewInfo = async () => {
  try {
    const response = await authApi.get("/schedule/walking-dog");
    return response.data;
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};

// 도로명 주소를 위도, 경도로 변환
export const convertRoadAddressToCoordinates = async (roadAddress) => {
  try {
    const response = await authApi.post("/walks/coordinate", {
      road_address: roadAddress,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};
