import axios from "axios";

const kakaoApi = axios.create({
  baseURL: "https://dapi.kakao.com/v2/local",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
  },
});

/*
export const getAddressToCoordinate = async (address) => {
  if (!address) {
    throw new Error("주소가 비어있습니다.");
  }
  try {
    const response = await kakaoApi.get("/search/address.json", {
      params: {
        query: address,
      },
    });
    console.log("getAddressToCoordinate response:", response.data);
    const { x, y } = response.data.documents[0].address;
    return { latitude: y, longitude: x };
  } catch (error) {
    console.error("Error fetching coordinates from address:", error);
    throw error;
  }
};
*/

export default kakaoApi;
