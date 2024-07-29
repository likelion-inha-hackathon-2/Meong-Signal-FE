import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import { getChatRoomMessages, enterChatRoom } from "../../apis/chatApi";
import { useLocation, useParams } from "react-router-dom";

// 채팅 메시지 리스트
const MessageList = styled.div`
  display: flex;
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
  padding: 10px 20px;
  background-color: var(--yellow-color2);
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ChatRoom = () => {
  const location = useLocation();
  const { id } = useParams();
  const { roomInfo, userInfo } = location.state || {}; // location.state가 null인 경우 기본값 설정
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);

  useEffect(() => {
    const initializeChatRoom = async () => {
      try {
        let fetchedRoomInfo = roomInfo;
        if (!fetchedRoomInfo) {
          fetchedRoomInfo = await enterChatRoom(id);
        }

        // 채팅방 메시지 가져오기
        const fetchChatMessages = async () => {
          try {
            const response = await getChatRoomMessages(fetchedRoomInfo.id);
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

          socket.current = new WebSocket(fetchedRoomInfo.websocket_url);

          socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            let senderProfileImage =
              message.sender === userInfo.id
                ? userInfo.profile_image
                : fetchedRoomInfo.other_user_profile_image;

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
  }, [id, roomInfo, userInfo]);

  const handleSendMessage = () => {
    if (newMessage.trim() && userInfo && roomInfo) {
      const message = {
        room: roomInfo.id,
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
        <h2>채팅방 id: {roomInfo?.id}</h2>
        <h3>대화 상대: {roomInfo?.other_user_nickname}</h3>
        <h3>타임스탬프: {roomInfo?.last_message_timestamp}</h3>
        <h3>최근대화: {roomInfo?.last_message_content}</h3>
        <h3>대화 상대 프로필 이미지: {roomInfo?.other_user_profile_image}</h3>
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
