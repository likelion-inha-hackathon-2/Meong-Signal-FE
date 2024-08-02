import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import authApi from "../../apis/authApi";
import CalenderIcon from "../../assets/icons/icon-calender-button.png";
import { getAccessToken } from "../../apis/authApi";
import { getUserInfo } from "../../apis/getUserInfo";
import {
  enterChatRoom,
  getChatRoomMessages,
  getAllChatRooms,
} from "../../apis/chatApi";
import { getDogOwnerInfo } from "../../apis/getDogInfo";
import { formatHourMinute } from "../../utils/time";
import Calendar from "../../components/Calendar/Calendar";
import Schedule from "../../components/Schedule/Schedule";

const ChatRoomHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  font-family: "PretendardB";
`;

const MessageList = styled.div`
  display: flex;
  width: 350px;
  flex-direction: column;
  margin-top: 10px;
  height: calc(100vh - 200px);
  font-family: "PretendardR";
  font-size: 14px;
  overflow-y: auto;
  gap: 10px;
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: ${(props) => (props.$isSender ? "row-reverse" : "row")};
  margin: 0 10px;
`;

const MessageBubble = styled.div`
  background-color: ${(props) =>
    props.$isSender ? "#e0e0e0" : "var(--yellow-color1)"};
  color: black;
  padding: 10px;
  border-radius: 8px;
  max-width: 70%;
  display: inline-block;
  text-align: ${(props) => (props.$isSender ? "right" : "left")};
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin: ${(props) => (props.$isSender ? "0 0 0 10px" : "0 10px 0 0")};
`;

const MessageMeta = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 12px;
  color: var(--gray-color3);
  margin-top: 5px;
  padding: 0 3px;
`;

const InputContainer = styled.div`
  display: flex;
  position: fixed;
  bottom: 50px;
  width: 350px;
  align-items: center;
  justify-content: baseline;
  padding: 10px 20px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  margin-bottom: 20px;
`;

const CalenderIconWrapper = styled.img`
  cursor: pointer;
  margin-right: 5px;
  position: relative;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
`;

const SendButton = styled(Button)`
  padding: 10px 20px;
  width: 70px;
  background-color: var(--yellow-color2);
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const TooltipWrapper = styled.div`
  position: absolute;
  top: 8%;
  left: 18%;
  z-index: 100;
`;

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const socket = useRef(null);
  const [otherUserNickname, setOtherUserNickname] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [dogId, setDogId] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [userId, setUserId] = useState(null); // 유저 id 추가

  useEffect(() => {
    const fetchDogAndOwnerInfo = async (dogId) => {
      try {
        const ownerResponse = await getDogOwnerInfo(dogId);
        return ownerResponse.owner_id;
      } catch (error) {
        console.error("Error fetching dog and owner info:", error);
      }
    };

    const fetchAllChatRooms = async () => {
      try {
        const chatRoomsData = await getAllChatRooms();
        const currentRoom = chatRoomsData.find(
          (room) => room.id === parseInt(roomId),
        );

        if (currentRoom) {
          // eslint-disable-next-line no-unused-vars
          const ownerID = await fetchDogAndOwnerInfo(currentRoom.dog_id);
          setDogId(currentRoom.dog_id);
          setOwnerId(currentRoom.owner_user); // owner_user를 ownerId로 설정
          setUserId(currentRoom.user_user); // user_user를 userId로 설정
        }
      } catch (error) {
        console.error("Failed to fetch all chat rooms:", error);
      }
    };

    fetchAllChatRooms();
  }, [roomId]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setUserInfo(userInfo);
      } catch (error) {
        console.error("사용자 정보를 가져오지 못했습니다: ", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const enterRoom = async () => {
      try {
        const response = await enterChatRoom(roomId);
        setOtherUserNickname(response.other_user_nickname);
        setDogId(response.dog_id);
      } catch (error) {
        console.error("Failed to enter chat room:", error);
        return;
      }

      const fetchChatMessages = async () => {
        try {
          const response = await getChatRoomMessages(roomId);
          setMessages(response);
        } catch (error) {
          console.error("Failed to fetch chat messages:", error);
        }
      };

      fetchChatMessages();

      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error("토큰이 없습니다");
        return;
      }

      const connectWebSocket = () => {
        if (socket.current) {
          socket.current.close();
        }

        socket.current = new WebSocket(
          "wss://" +
            process.env.REACT_APP_BACKEND_DOMAIN +
            "/ws/chat/" +
            roomId +
            "/?token=" +
            encodeURIComponent(accessToken),
        );

        socket.current.onmessage = async (event) => {
          const message = JSON.parse(event.data);

          const response = await authApi.post("/users/profile-image", {
            id: message.sender_id,
          });

          let nowMessage = {
            content: message.content,
            sender: message.sender_id,
            timestamp: message.timestamp,
            sender_profile_image: response.data.image,
          };

          setMessages((prevMessages) => [...prevMessages, nowMessage]);
        };

        socket.current.onclose = (event) => {
          console.error("WebSocket이 닫혔습니다: ", event);
        };
      };

      connectWebSocket();

      return () => {
        if (socket.current) {
          socket.current.close();
        }
      };
    };

    enterRoom();
  }, [roomId]);

  const handleSendMessage = () => {
    if (newMessage.trim() && userInfo) {
      const message = {
        room: roomId,
        sender: userInfo.id,
        sender_profile_image: userInfo.profile_image,
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: false,
      };

      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify(message));
        setNewMessage("");
      } else {
        console.error("WebSocket이 아직 연결되지 않았습니다.");
      }
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleSaveReservation = (appointment) => {
    setReservation(appointment);
  };

  const handleUpdateReservation = (updatedAppointment) => {
    setReservation(updatedAppointment);
  };

  const handleCloseSchedule = () => {
    setReservation(null);
  };

  return (
    <>
      <Header />
      <ChatRoomHeader>📪{otherUserNickname}</ChatRoomHeader>
      <MessageList>
        {messages.map((msg, index) => (
          <MessageContainer key={index} $isSender={msg.sender === userInfo?.id}>
            <ProfileImage
              src={msg.sender_profile_image}
              alt="프로필 사진"
              $isSender={msg.sender === userInfo?.id}
            />
            <MessageBubble $isSender={msg.sender === userInfo?.id}>
              {msg.content}
            </MessageBubble>
            <MessageMeta>
              {formatHourMinute(msg.timestamp)}
              {msg.user_read && msg.owner_read ? "✅" : ""}
            </MessageMeta>
          </MessageContainer>
        ))}
      </MessageList>
      <InputContainer>
        <CalenderIconWrapper
          src={CalenderIcon}
          alt="캘린더 아이콘"
          onClick={toggleCalendar}
        />

        <TextInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요."
        />
        <SendButton text="전송" onClick={handleSendMessage} />
      </InputContainer>
      {showCalendar && (
        <TooltipWrapper>
          <Calendar
            dogId={dogId}
            userId={userId}
            ownerId={ownerId}
            onClose={() => setShowCalendar(false)}
            onSave={handleSaveReservation}
          />
        </TooltipWrapper>
      )}
      {reservation && (
        <Schedule
          appointment={reservation}
          onUpdate={handleUpdateReservation}
          onClose={handleCloseSchedule}
        />
      )}
      <Footer />
    </>
  );
};

export default ChatRoom;
