import axios from "axios";

const kakaoApi = axios.create({
  baseURL: "https://dapi.kakao.com/v2/local",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
  },
});

// 집 주소를 보내면 위도, 경도와 함께 변환
export const getCoordinates = async (roadAddress) => {
  try {
    const response = await kakaoApi.get("/search/address.json", {
      params: {
        query: roadAddress,
      },
    });
    const { documents } = response.data;
    if (documents.length > 0) {
      const { y: latitude, x: longitude } = documents[0].address;
      return {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
    } else {
      throw new Error("No coordinates found.");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};

// 심심한 상태의 강아지를 조회
export const getBoringDogs = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/dogs/boring`,
    );
    console.log("심심한 강아지 목록:", response.data); // 테스트 로그
    return response.data.dogs;
  } catch (error) {
    console.error(
      "Error fetching boring dogs:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export default kakaoApi;
