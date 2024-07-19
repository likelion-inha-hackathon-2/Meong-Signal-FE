import React from "react";
import styled from "styled-components";
import iconMap from "../../assets/icons/icon-map.png";
import iconChat from "../../assets/icons/icon-chat.png";
import iconMain from "../../assets/icons/icon-main.png";
import iconWalk from "../../assets/icons/icon-walk.png";
import iconUser from "../../assets/icons/icon-user.png";
import { useNavigate } from "react-router-dom";

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
    gap: 60px;
  }
`;

const Icon = styled.img`
  cursor: pointer;
`;

const icons = [
  { src: iconMap, path: "/map-info" },
  { src: iconChat, path: "/chat" },
  { src: iconMain, path: "/home" },
  { src: iconWalk, path: "/walk" },
  { src: iconUser, path: "/myinfo-main" },
];

const Footer = () => {
  const navigate = useNavigate();

  const handleIconClick = (path) => {
    navigate(path);
  };

  return (
    <FooterWrapper>
      {icons.map((icon, index) => (
        <Icon
          key={index}
          src={icon.src}
          onClick={() => handleIconClick(icon.path)}
        />
      ))}
    </FooterWrapper>
  );
};

export default Footer;
