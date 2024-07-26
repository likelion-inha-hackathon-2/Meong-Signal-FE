import authApi from "./authApi";

// 새로운 채팅방 만들기
export const createChatRoom = async (ownerUserId, userUserId) => {
  try {
    const response = await authApi.post("/chat/newroom", {
      owner_user: ownerUserId,
      user_user: userUserId,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create chat room:", error);
    throw error;
  }
};
