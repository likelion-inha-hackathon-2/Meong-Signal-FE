import React from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const Test = styled.div`
  font-family: "PretendardM";
`;

const ChatRoom = () => {
  return (
    <>
      <Header />
      <Test>채팅방 보여주는 페이지!</Test>

      <Footer />
    </>
  );
};

export default ChatRoom;
