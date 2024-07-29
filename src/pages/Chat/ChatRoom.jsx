import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import authApi from "../../apis/authApi";
import CalenderIcon from "../../assets/icons/icon-calender-button.png";
import { getAccessToken } from "../../apis/authApi";
import { getUserInfo } from "../../apis/getUserInfo";
import { enterChatRoom, getChatRoomMessages } from "../../apis/chatApi";
import { useParams } from "react-router-dom"; // url 뒤에 붙은 채팅방 고유 넘버를 가져오기

const ChatRoomHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  font-family: "PretendardB";
`;

// 채팅 메시지 리스트
const MessageList = styled.div`
  display: flex;
  width: 350px;
  flex-direction: column;
  margin-top: 50px;
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
  margin-bottom: 15px;
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

const InputContainer = styled.div`
  display: flex;
  width: 350px;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  margin-bottom: 20px;
`;

// 캘린더 버튼
const CalenderIconWrapper = styled.img`
  cursor: pointer;
  margin-right: 5px;
`;

// 메시지 입력 창
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

const ChatRoom = () => {
  const { roomId } = useParams(); // url로부터 roomId를 가져옴
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보를 저장할 상태
  const socket = useRef(null); // WebSocket을 useRef로 관리
  const [otherUserNickname, setOtherUserNickname] = useState(""); // 상대방 닉네임 상태
  // other_user_nickname

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
    // 채팅방에 입장
    const enterRoom = async () => {
      try {
        const response = await enterChatRoom(roomId);
        setOtherUserNickname(response.other_user_nickname);
      } catch (error) {
        console.error("Failed to enter chat room:", error);
        return;
      }

      // 메시지 목록 조회
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
        console.error("토큰 x");
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

  return (
    <>
      <Header />
      <ChatRoomHeader>{otherUserNickname}</ChatRoomHeader>
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
          </MessageContainer>
        ))}
      </MessageList>
      <InputContainer>
        <CalenderIconWrapper src={CalenderIcon} alt="캘린더 아이콘" />
        <TextInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요."
        />
        <SendButton text="전송" onClick={handleSendMessage} />
      </InputContainer>
      <Footer />
    </>
  );
};

export default ChatRoom;
