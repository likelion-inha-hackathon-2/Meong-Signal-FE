import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const ChatRoomContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: var(--yellow-color1);
  width: 350px;
  font-family: "PretendardM";
  cursor: pointer; /* 클릭 가능하게 커서 변경 */
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 20px;
`;

const ChatInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: black;
`;

const Nickname = styled.div`
  font-weight: bold;
  font-size: 18px;
`;

const LastMessage = styled.div`
  color: #444444;
  margin: 5px 0;
`;

const LastTimeStamp = styled.div`
  color: gray;
  font-size: 12px;
  text-align: right;
`;

const Chat = ({ room }) => {
  const navigate = useNavigate();
  const lastMessageContent = room.last_message_content || "메시지가 없습니다.";
  const lastMessageTimestamp =
    room.last_message_timestamp !== "시간 정보 없음"
      ? new Date(room.last_message_timestamp).toLocaleString()
      : "시간 정보 없음";

  const handleClick = () => {
    navigate(`/chat/rooms/${room.id}`); // room.id로 이동
  };

  return (
    <ChatRoomContainer onClick={handleClick}>
      <ProfileImage
        src={room.other_user_profile_image}
        alt={`${room.other_user_nickname}님의 프로필 사진`}
      />
      <ChatInfo>
        <Nickname>{room.other_user_nickname}</Nickname>
        <LastMessage>{lastMessageContent}</LastMessage>
        <LastTimeStamp>{lastMessageTimestamp}</LastTimeStamp>
      </ChatInfo>
    </ChatRoomContainer>
  );
};

Chat.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.number.isRequired,
    other_user_profile_image: PropTypes.string,
    other_user_nickname: PropTypes.string.isRequired,
    last_message_content: PropTypes.string,
    last_message_timestamp: PropTypes.string,
  }).isRequired,
};

export default Chat;
