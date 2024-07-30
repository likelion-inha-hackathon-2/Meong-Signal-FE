import authApi from "./authApi";
import { getUserInfo } from "./getUserInfo";

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

// 새로운 채팅방 생성
export const createChatRoom = async (dogId) => {
  try {
    // 견주 정보 조회
    const ownerInfo = await getOwnerInfo(dogId);
    const ownerId = ownerInfo.owner_id;

    // 본인 유저 아이디 조회
    const userInfo = await getUserInfo();
    const userId = userInfo.id;

    // 동일한 상대에게 채팅 못 보내도록 처리
    if (ownerId === userId) {
      alert("본인에게는 채팅을 보낼 수 없습니다.");
      return;
    }

    const response = await authApi.post("/chat/newroom", {
      owner_user: ownerId,
      user_user: userId,
    });

    return response.data; // 여기서 romm id 리턴
  } catch (error) {
    console.error("Failed to create chat room:", error);
    throw error;
  }
};

// room id로 채팅방 입장
export const enterChatRoom = async (roomId) => {
  try {
    console.log(`채팅방에 입장하는 룸 넘버: ${roomId}`);
    const response = await authApi.get(`/chat/rooms/${roomId}`);
    console.log(response.data);
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

// 특정 사용자의 프로필 사진 확인(user_id)
export const getProfileImage = async (userId) => {
  try {
    const response = await authApi.post("/users/profile-image", {
      id: userId,
    });
    return response.data.image;
  } catch (error) {
    console.error("Failed to fetch profile image:", error);
    throw error;
  }
};

// chat/rooms 엔드포인트에서 데이터를 가져오는 함수
export const fetchChatRooms = async () => {
  try {
    const response = await authApi.get("/chat/rooms");
    return response.data;
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    throw error;
  }
};

// 읽지 않은 메시지의 개수를 계산하는 함수
export const countUnreadMessages = async () => {
  try {
    const rooms = await fetchChatRooms();
    const unreadCount = rooms.filter((room) => !room.last_message_read).length;
    return unreadCount;
  } catch (error) {
    console.error("Error counting unread messages:", error);
    throw error;
  }
};
