import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

// 외부 레이아웃
const LayoutWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  min-height: 100vh; // 최소 높이를 100vh로 설정하여 화면 전체를 채움
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
  min-height: 100vh; // 최소높이를 100vh로 설정
  height: auto; // 컨텐츠에 따라 자동 맞추기
  background-color: var(--white-color);
  margin: 0 auto; // 중앙정렬
  padding: 50px 10px; // 기본 여백 - 컨텐츠 잘림 방지

  // 모바일 디바이스 여백
  @media (max-width: 768px) {
    padding: 50px 10px;
  }

  // 데스크탑 여백
  @media (min-width: 1024px) {
    padding: 100px 10px; // 데스크탑 여백이 더 커야함..
  }
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
