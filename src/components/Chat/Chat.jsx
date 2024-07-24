import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ChatRoomContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: var(--yellow-color1);
  width: 350px;
  font-family: "PretendardM";
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
  return (
    <ChatRoomContainer>
      <ProfileImage
        src={room.other_user_profile_image || "/default-profile.png"}
        alt={`${room.other_user_nickname}님의 프로필 사진`}
      />
      <ChatInfo>
        <Nickname>{room.other_user_nickname}</Nickname>
        <LastMessage>{room.last_message_content}</LastMessage>
        <LastTimeStamp>
          {new Date(room.last_message_timestamp).toLocaleString()}
        </LastTimeStamp>
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
