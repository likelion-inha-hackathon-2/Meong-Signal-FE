import React, { useState, useEffect } from "react";
import styled from "styled-components";
import iconMap from "../../assets/icons/icon-map.png";
import iconChat from "../../assets/icons/icon-chat.png";
import iconMain from "../../assets/icons/icon-main.png";
import iconWalk from "../../assets/icons/icon-walk.png";
import iconUser from "../../assets/icons/icon-user.png";
import { useNavigate } from "react-router-dom";
import { countUnreadMessages } from "../../apis/chatApi"; // 경로는 실제 authApi 파일 위치에 맞게 수정하세요.

const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 29px;
  width: 100%;
  height: 56px;
  background-color: var(--yellow-color2);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  //아래에 고정
  position: fixed;
  bottom: 0;
  z-index: 100;

  // 너비 넓어지면 사이 간격 넓히기
  @media (min-width: 769px) {
    gap: 70px;
  }
`;

const IconWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const Icon = styled.img`
  display: block;
`;

// 아직 안 읽은 메시지
const UnreadBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 5px;
  font-size: 10px;
`;

const icons = [
  { src: iconMap, path: "/map-info" },
  { src: iconWalk, path: "/walk" },
  { src: iconMain, path: "/home" },
  { src: iconChat, path: "/chat" },
  { src: iconUser, path: "/myinfo-main" },
];

const Footer = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const count = await countUnreadMessages();
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    fetchUnreadMessages();
  }, []);

  const handleIconClick = (path) => {
    navigate(path);
  };

  return (
    <FooterWrapper>
      {icons.map((icon, index) => (
        <IconWrapper key={index} onClick={() => handleIconClick(icon.path)}>
          <Icon src={icon.src} />
          {icon.src === iconChat && unreadCount > 0 && (
            <UnreadBadge>{unreadCount}</UnreadBadge>
          )}
        </IconWrapper>
      ))}
    </FooterWrapper>
  );
};

export default Footer;
