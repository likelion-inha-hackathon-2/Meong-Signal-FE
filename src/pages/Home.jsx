import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Button from "../components/Button/Button";
import Walking from "../assets/images/walking.png";
import { getAllDogs } from "../apis/getAllDogs";
import { getUserInfo } from "../apis/getUserInfo";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BoldText = styled.div`
  font-family: "PretendardB";
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  opacity: 1;
  white-space: nowrap;
  margin: 20px;
`;

const NormalText = styled.div`
  font-family: "PretendardR";
  font-size: 18px;
  font-weight: 400;
  line-height: 28px;
  text-align: center;
  width: 260px;
  height: 56px;
`;

const WalkingButton = styled(Button)`
  position: absolute;
  bottom: 100px;
  z-index: 99;
  width: 174px;
  height: 43px;
  margin: 20px auto;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background-color: var(--pink-color2);
  &:hover {
    background-color: var(--pink-color3);
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const [dogCount, setDogCount] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dogResponse, userResponse] = await Promise.all([
          getAllDogs(),
          getUserInfo(),
        ]);

        // 주변에 강아지가 없으면 0으로 (빈 배열 예외처리)
        setDogCount(dogResponse.length ? dogResponse.length : 0);
        setUserName(userResponse.nickname);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleButtonClick = () => {
    navigate("/map-info");
  };

  return (
    <>
      <Header />
      <HomeContainer>
        <BoldText>같이 산책해요!</BoldText>
        <NormalText>
          <p>지금 주변의 {dogCount}마리의 강아지들이</p>
          <p>{userName}님을 기다리고 있어요.</p>
        </NormalText>
        <img src={Walking} alt="Walking" />
        <WalkingButton text="산책하러 가기" onClick={handleButtonClick} />
      </HomeContainer>
      <Footer />
    </>
  );
};

export default Home;
