import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Walking from "../assets/images/walking.png";

const BoldText = styled.div`
  font-family: "pretendardB";
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  margin: 20px auto; /* 센터 정렬을 위해 margin 사용 */
  opacity: 1;
  white-space: nowrap;
`;

const WalkingButton = styled.div`
  width: 174px;
  height: 43px;
  margin: 20px auto;
  padding: 9px 45px;
  border-radius: 8px;
  background-color: #ff9b86;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 60px; /* 화면 아래에서 60px 위로 위치 */
  left: 50%; /* 수평 가운데 정렬 */
  transform: translateX(-50%); /* 수평 가운데 정렬 보정 */
  cursor: pointer;
`;

const NormalText = styled.div`
  ffont-family: "pretendardR";
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  text-align: center;
  width: 260px;
  height: 56px;
  margin: 10px auto; /* 센터 정렬을 위해 margin 사용 */
  opacity: 1;
`;

const WalkingImage = styled.img`
  width: 321px;
  height: 338px;
`;

const ButtonText = styled.span`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  color: white;
  font-family: "pretendardB";
`;

const Home = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/map-info"); // 이동할 경로를 설정
  };

  return (
    <>
      <Header />
      <BoldText>같이 산책해요!</BoldText>
      <NormalText>
        지금 주변의 12마리의 강아지들이 사용자님을 기다리고 있어요.
      </NormalText>

      <WalkingImage src={Walking} alt="Walking" />

      <WalkingButton onClick={handleButtonClick}>
        <ButtonText>산책하러 가기</ButtonText>
      </WalkingButton>
      <Footer />
    </>
  );
};

export default Home;
