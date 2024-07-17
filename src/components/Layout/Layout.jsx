import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

// 외부 레이아웃
const LayoutWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  height: 100vh;
  width: 100vw;
  padding: 56px auto;

  // 데스크탑에서 여백을 그라데이션으로 채우기
  @media (min-width: 1024px) {
    background: #efefbb;
    background: -webkit-linear-gradient(
      to top,
      #d4d3dd,
      #efefbb
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to top,
      #d4d3dd,
      #efefbb
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
`;

// 내부 레이아웃
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 375px; // 최소너비 아이폰se
  max-width: 450px; // 최대너비 모바일 기본
  min-height: 667px; // 최소높이 아이폰se
  height: auto; // 컨텐츠에 따라 자동 맞추기
  background-color: var(--white-color);
  padding: 0 10px;
  margin: 0 auto; // 중앙정렬
`;

const Layout = () => {
  return (
    <LayoutWrapper>
      <LayoutContainer>
        <Outlet />
      </LayoutContainer>
    </LayoutWrapper>
  );
};

export default Layout;
