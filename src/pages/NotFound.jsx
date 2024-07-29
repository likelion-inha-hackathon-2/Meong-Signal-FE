import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import styled from "styled-components";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const ErrorMessage = styled.div`
  font-family: "PretendardM";
  margin-bottom: 30px;
  font-size: 13px;
`;
const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // -1은 이전 페이지로 이동하는 것을 의미합니다.
  };

  return (
    <>
      <Header />
      <ErrorMessage>
        페이지를 찾을 수 없습니다. URL을 다시 확인해주세요.{" "}
      </ErrorMessage>
      <Button onClick={handleGoBack} text={"뒤로가기"}></Button>
      <Footer />
    </>
  );
};

export default NotFound;
