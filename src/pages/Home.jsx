import React from "react";
import styled from "styled-components";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const Test = styled.div`
  font-family: "PretendardM";
  color: var(--blue-color);
`;

const Home = () => {
  return (
    <>
      <Header />
      <Test>테스트</Test>
      텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미
      텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미
      텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미
      텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미
      텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미
      텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미
      텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미
      텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미 텍스트더미
      <Footer />
    </>
  );
};

export default Home;
