import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import authApi from "../../apis/authApi";
import Chat from "../../components/Chat/Chat";
import { formatTimestamp } from "../../utils/time";
import ReservationList from "../../components/Reservation/ReservationList";

const ChatRoomContainer = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  align-items: center;
  justify-content: center;
`;

// 채팅방 컴포넌트 리스트
const ChatRoomList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const Loading = styled.div`
  font-family: "PretendardS";
`;

const EmptyMessage = styled.div`
  font-family: "PretendardM";
`;

const TitleWrapper = styled.div`
  font-size: 20px;
  display: flex;
  font-family: "PretendardB";
  margin-top: 10px;
`;

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await authApi.get("/chat/rooms");
        const rooms = response.data.map((room) => ({
          ...room,
          last_message_content:
            room.last_message_content || "메시지가 없습니다.",
          last_message_timestamp: formatTimestamp(room.last_message_timestamp),
        }));
        setChatRooms(rooms);
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
      <ChatRoomContainer>
        <TitleWrapper>📌 산책 일정</TitleWrapper>
        <ReservationList />
        <TitleWrapper>💌 채팅 기록</TitleWrapper>
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
      </ChatRoomContainer>
      <Footer />
    </>
  );
};

export default ChatList;
