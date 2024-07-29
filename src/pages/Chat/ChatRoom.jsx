import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import { getChatRoomMessages, enterChatRoom } from "../../apis/chatApi";
import { useLocation, useParams } from "react-router-dom";
import { getUserInfo } from "../../apis/getUserInfo";

// 채팅 메시지 리스트
const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  margin-top: 50px;
  height: calc(100vh - 200px);
  font-family: "PretendardR";
  font-size: 14px;
  overflow-y: auto;
  gap: 10px;
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${(props) => (props.$isSender ? "flex-end" : "flex-start")};
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

const TextInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
`;

const SendButton = styled(Button)`
  width: 70px;
  padding: 10px 20px;
  background-color: var(--yellow-color2);
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ChatRoom = () => {
  const location = useLocation();
  const { roomId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);
  const socket = useRef(null);

  console.log("room id:", roomId);

  useEffect(() => {
    const initializeChatRoom = async () => {
      if (!roomId) {
        console.error("룸 id가 제공되지 않았습니다.");
        return;
      }

      try {
        // 사용자 정보 가져오기
        const fetchedUserInfo = await getUserInfo();
        setUserInfo(fetchedUserInfo);

        // 채팅방 정보 가져오기
        const fetchedRoomInfo = await enterChatRoom(roomId);
        setRoomInfo(fetchedRoomInfo);

        // 채팅방 메시지 가져오기
        const fetchChatMessages = async () => {
          try {
            const response = await getChatRoomMessages(fetchedRoomInfo.room_id);
            setMessages(response);
          } catch (error) {
            console.error("Failed to fetch chat messages:", error);
          }
        };

        fetchChatMessages();

        // 웹소켓 연결
        const connectWebSocket = () => {
          if (socket.current) {
            socket.current.close();
          }

          socket.current = new WebSocket(fetchedRoomInfo.websocket_url); // 웹소켓 서버 주소

          socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            // 프사 설정
            let senderProfileImage =
              message.sender === userInfo.id
                ? userInfo.profile_image
                : fetchedRoomInfo.other_user_profile_image;

            // 보낼 메시지 설정
            let nowMessage = {
              content: message.content,
              sender: message.sender,
              timestamp: message.timestamp,
              sender_profile_image: senderProfileImage,
            };

            setMessages((prevMessages) => [...prevMessages, nowMessage]);
          };

          socket.current.onclose = (event) => {
            console.error("WebSocket이 닫혔습니다: ", event);
          };
          socket.current.onerror = (error) => {
            console.error("WebSocket 에러: ", error);
          };
          socket.current.onopen = () => {
            console.log("WebSocket 연결 성공");
          };
        };

        if (fetchedRoomInfo.websocket_url) {
          connectWebSocket();
        }

        return () => {
          if (socket.current) {
            socket.current.close();
          }
        };
      } catch (error) {
        console.error("Failed to initialize chat room:", error);
      }
    };

    initializeChatRoom();
  }, [roomId]);

  const handleSendMessage = () => {
    if (newMessage.trim() && userInfo && roomInfo) {
      const message = {
        room: roomInfo.room_id,
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
      <div>
        <h2>채팅방 id: {roomInfo?.room_id}</h2>
        <h3>대화 상대: {roomInfo?.other_user_nickname}</h3>
        <h3>타임스탬프: {roomInfo?.last_message_timestamp}</h3>
        <h3>최근대화: {roomInfo?.last_message_content}</h3>
        <h3>대화 상대 프로필 이미지: {roomInfo?.other_user_profile_image}</h3>
        <h3>룸 이름: {roomInfo?.room_name}</h3>
      </div>
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
