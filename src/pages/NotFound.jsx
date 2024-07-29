import React from "react";
import styled from "styled-components";
import Button from "../components/Button/Button";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const ErrorMessage = styled.div`
  font-family: "PretendardM";
  margin-bottom: 30px;
  font-size: 16px;
`;
const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header />
      <ErrorMessage>
        페이지를 찾을 수 없습니다. URL을 다시 확인해주세요.
      </ErrorMessage>
      <Button onClick={handleGoBack} text={"뒤로가기"}></Button>
      <Footer />
    </>
  );
};

export default NotFound;
