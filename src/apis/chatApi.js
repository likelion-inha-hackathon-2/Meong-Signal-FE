import authApi from "./authApi";
// import { getUserInfo } from "./getUserInfo";

// 견주의 정보를 조회 (id, email, image, nickname)
export const getOwnerInfo = async (dogId) => {
  try {
    const response = await authApi.post("/dogs/owner", { dog_id: dogId });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch owner user ID:", error);
    throw error;
  }
};

// 특정 사용자의 프로필 사진 확인
export const getProfileImage = async (Id) => {
  try {
    const response = await authApi.post("/users/profile-image", { id: Id });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch owner user ID:", error);
    throw error;
  }
};

// 새로운 채팅방 생성
export const createChatRoom = async (dogId, userId, ownerId) => {
  try {
    const response = await authApi.post("/chat/newroom", {
      owner_user: ownerId,
      user_user: userId,
    });
    return response.data; // 여기서 room id 나옴
  } catch (error) {
    console.error("Failed to create chat room:", error);
    throw error;
  }
};

// room id로 채팅방 입장하여 룸 정보 조회하는 부분
/*{
  "room_id": 
  "room_name":
  "other_user_nickname": 
  "other_user_profile_image": 
  "websocket_url":
}*/
export const enterChatRoom = async (roomId) => {
  try {
    const response = await authApi.get(`/chat/rooms/${roomId}`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to enter chat room:", error);
    throw error;
  }
};

// room id로 채팅방 메시지 반환
export const getChatRoomMessages = async (roomId) => {
  try {
    const response = await authApi.get(`/chat/rooms/${roomId}/data`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chat room messages:", error);
    throw error;
  }
};

// 채팅방 목록 조회
export const getChatRooms = async () => {
  try {
    const response = await authApi.get("/chat/rooms");
    return response.data;
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    throw error;
  }
};
