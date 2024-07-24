import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import { useParams } from "react-router-dom";

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

// 내가 메시지를 입력하는 창
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
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // 여기에 직접 입력하고 테스트 가능!
    const dummy = [
      {
        /* 더미 데이터 여기에 복붙  */
      },
    ];
    setMessages(dummy);

    // 웹소켓 연결
    // const socket = new WebSocket('ws://링크주소');
    // socket.onmessage = (event) => {
    //   const message = JSON.parse(event.data);
    //   setMessages((prevMessages) => [...prevMessages, message]);
    // };

    // return () => {
    //   socket.close();
    // };
  }, [roomId]);

  // 사용자가 보내는 메시지 처리 (POST)
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        room: roomId,
        sender: 1, // 현재 사용자 ID
        sender_profile_image:
          "https://meong-signal-s3-bucket.s3.ap-northeast-2.amazonaws.com/users/default_user.jpg",
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: false,
      };

      // 메시지 보내기
      // socket.send(JSON.stringify(message));

      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");
    }
  };

  return (
    <>
      <Header />
      <MessageList>
        {messages.map((msg) => (
          <MessageContainer key={msg.id} $isSender={msg.sender === 1}>
            <ProfileImage
              src={msg.sender_profile_image}
              alt="프로필 사진"
              $isSender={msg.sender === 1}
            />
            <MessageBubble $isSender={msg.sender === 1}>
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
