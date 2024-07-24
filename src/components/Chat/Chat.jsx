import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ChatRoomContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ccc;
  margin-right: 10px;
`;

const ChatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Nickname = styled.div`
  font-weight: bold;
`;

const LastMessage = styled.div`
  color: var(--gray-color1);
`;

const Chat = ({ room }) => {
  return (
    <ChatRoomContainer>
      <ProfileImage
        src={room.other_user_profile_image}
        alt={`${room.other_user_nickname}님의 프로필 사진`}
      />
      <ChatInfo>
        <Nickname>{room.other_user_nickname}</Nickname>
        <LastMessage>{room.last_message_content}</LastMessage>
        <LastMessage>
          {new Date(room.last_message_timestamp).toLocaleString()}
        </LastMessage>
      </ChatInfo>
    </ChatRoomContainer>
  );
};

Chat.propTypes = {
  room: PropTypes.shape({
    other_user_profile_image: PropTypes.string,
    other_user_nickname: PropTypes.string.isRequired,
    last_message_content: PropTypes.string.isRequired,
    last_message_timestamp: PropTypes.string.isRequired,
  }).isRequired,
};

export default Chat;
