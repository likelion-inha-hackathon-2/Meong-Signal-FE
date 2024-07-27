import authApi from "./authApi";
import { getUserInfo } from "./getUserInfo";

// 견주의 정보를 조회 (id, email, image, nickname)
export const getOwnerInfo = async (dogId) => {
  try {
    const response = await authApi.post("/dogs/owner", { dogId });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch owner user ID:", error);
    throw error;
  }
};

// 새로운 채팅방 생성
export const createChatRoom = async (dogId) => {
  try {
    // 견주 정보 조회
    const ownerInfo = await getOwnerInfo(dogId);
    const ownerId = ownerInfo.owner_id;

    // 본인 유저 아이디 조회
    const userInfo = await getUserInfo();
    const userId = userInfo.id;

    const response = await authApi.post("/chat/newroom", {
      owner_id: ownerId,
      user_id: userId,
    });

    return response.data; // 여기서 romm id 나옴
  } catch (error) {
    console.error("Failed to create chat room:", error);
    throw error;
  }
};

// room id로 채팅방 메시지 반환
export const getChatRoomMessages = async (roomId) => {
  try {
    const response = await authApi.get(`/chat/rooms/${roomId}/messages`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chat room messages:", error);
    throw error;
  }
};
