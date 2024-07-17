import React from "react";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 56px;
  background-color: var(--yellow-color2);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;

  // 위에 고정
  position: fixed;
  top: 0;
  z-index: 100;
`;

const Header = () => {
  return <HeaderWrapper></HeaderWrapper>;
};

export default Header;
