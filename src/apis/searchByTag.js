import authApi from "./authApi";

// 태그 별 강아지 목록 조회 - 필터링 페이지에 사용
export const searchByTag = async (tag_number, location) => {
  try {
    const response = await authApi.post(`/dogs/search-by-tag/${tag_number}`, {
      latitude: location.latitude,
      longitude: location.longitude,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch dogs by tag ${tag_number}:`, error);
    throw error;
  }
};
