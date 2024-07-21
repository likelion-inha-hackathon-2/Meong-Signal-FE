import React from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const Test = styled.div`
  font-family: "PretendardM";
`;

const WalkDetail = () => {
  return (
    <>
      <Header />
      <Test>챌린지 및 산책로 추천</Test>

      <Footer />
    </>
  );
};

export default WalkDetail;
