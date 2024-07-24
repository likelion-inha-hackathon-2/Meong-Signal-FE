import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import authApi from "../../apis/authApi";
import Chat from "../Chat/Chat";

// 채팅방 컴포넌트 리스트
const ChatRoomList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await authApi.get("/chat/rooms");
        setChatRooms(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  return (
    <>
      <Header />
      {loading ? (
        <div>로딩 중...</div>
      ) : chatRooms.length === 0 ? (
        <div>채팅방 목록이 비어있어요.</div>
      ) : (
        <ChatRoomList>
          {chatRooms.map((room, index) => (
            <Chat key={index} room={room} />
          ))}
        </ChatRoomList>
      )}
      <Footer />
    </>
  );
};

export default ChatList;
