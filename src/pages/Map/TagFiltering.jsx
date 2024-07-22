import React from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const Test = styled.div`
  font-family: "PretendardM";
`;

const TagFiltering = () => {
  return (
    <>
      <Header />
      <Test>지도 탭에서 태그 필터링 페이지</Test>

      <Footer />
    </>
  );
};

export default TagFiltering;
