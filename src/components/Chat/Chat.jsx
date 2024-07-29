import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const ChatRoomContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.read ? "var(--gray-color1)" : "var(--yellow-color1)"};
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
  flex: 1;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NicknameContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Nickname = styled.div`
  font-weight: bold;
  font-size: 18px;
`;

const RepresentativeBadge = styled.div`
  background-color: var(--white-color);
  border-radius: 4px;
  border: 2px solid var(--yellow-color2);
  padding: 2px 4px;
  margin-right: 5px;
  font-size: 14px;
  margin-left: 5px;
`;

const LastMessage = styled.div`
  color: #444444;
  margin: 10px 0;
  padding-left: 2px;
`;

const LastTimeStamp = styled.div`
  color: gray;
  font-size: 12px;
  text-align: right;
`;

const formatTimestamp = (timestamp) => {
  if (!timestamp || isNaN(Date.parse(timestamp))) {
    return "시간 정보 없음";
  }
  const now = dayjs();
  const messageTime = dayjs(timestamp);
  const diffMinutes = now.diff(messageTime, "minute");
  const diffHours = now.diff(messageTime, "hour");
  const diffDays = now.diff(messageTime, "day");

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else {
    return `${diffDays}일 전`;
  }
};

const Chat = ({ room }) => {
  const navigate = useNavigate();
  const lastMessageContent =
    room.last_message_content || "대화 내용이 없습니다.";
  const lastMessageTimestamp = formatTimestamp(room.last_message_timestamp);

  const handleClick = () => {
    navigate(`/chat/rooms/${room.id}`); // room.id로 이동
  };

  return (
    <ChatRoomContainer onClick={handleClick} read={room.last_message_read}>
      <ProfileImage
        src={room.other_user_profile_image}
        alt={`${room.other_user_nickname}님의 프로필 사진`}
      />
      <ChatInfo>
        <ChatHeader>
          <NicknameContainer>
            {room.other_user_representative && (
              <RepresentativeBadge>대표</RepresentativeBadge>
            )}
            <Nickname>{room.other_user_nickname}</Nickname>
          </NicknameContainer>
        </ChatHeader>
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
    last_message_read: PropTypes.bool.isRequired,
    other_user_representative: PropTypes.bool,
  }).isRequired,
};

export default Chat;
