import authApi from "./authApi";

// 특정 강아지의 상태 업데이트
export const updateDogStatus = async (id, status) => {
  try {
    const response = await authApi.patch(`/dogs/status/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating dog status:", error);
    throw error;
  }
};
