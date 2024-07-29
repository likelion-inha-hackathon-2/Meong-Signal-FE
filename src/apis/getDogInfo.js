import authApi from "./authApi";

// 특정 강아지의 산책기록 조회
export const getDogInfo = async (dogId) => {
  try {
    const response = await authApi.get(`/dogs/${dogId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dog info:", error);
    throw error;
  }
};

// 특정 강아지의 산책 기록 조회
export const getDogWalkInfo = async (id) => {
  try {
    const response = await authApi.get(`/dogs/${id}/walk`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dog walk info:", error);
    throw error;
  }
};

// 특정 강아지의 견주 정보 조회
export const getDogOwnerInfo = async (dogId) => {
  try {
    const response = await authApi.post("/dogs/owner", {
      dog_id: dogId,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dog info:", error);
    throw error;
  }
};
