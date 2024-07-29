import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getChatRooms } from "../../apis/chatApi";
import Chat from "../../components/Chat/Chat";

// 채팅방 컴포넌트 리스트
const ChatRoomList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const Loading = styled.div`
  font-family: "PretendardS";
`;

const EmptyMessage = styled.div`
  font-family: "PretendardM";
`;

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 유저가 속한 채팅방 목록 반환 - roomId 필요!
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const rooms = await getChatRooms();
        const formattedRooms = rooms.map((room) => ({
          ...room,
          last_message_content:
            room.last_message_content || "메시지가 없습니다.",
          last_message_timestamp:
            room.last_message_timestamp || "시간 정보가 없습니다.",
        }));
        setChatRooms(formattedRooms);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
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
        <Loading>로딩 중...</Loading>
      ) : chatRooms.length === 0 ? (
        <EmptyMessage>채팅방 목록이 비어있어요.</EmptyMessage>
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
