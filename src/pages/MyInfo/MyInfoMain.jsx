import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import Image from "../../components/Image/Image";
import { getUserInfo } from "../../apis/authApi";
import authApi from "../../apis/authApi";
import DogInfo from "../../components/Info/DogInfo";

const StyledImage = styled(Image)`
  width: 100px;
  height: 100px;
  pointer-events: none; // nonclick
`;

const MyInfoButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 20px;
`;

const SectionTitle = styled.h3`
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 20px;
  font-family: "PretendardB";
  text-align: left;
`;

const UserInfo = styled.div`
  padding: 20px;
  font-family: "pretendardS";
  font-size: 14px;
  justify-content: center;
  align-items: center;
`;

const MyDogInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 90px;
  margin-bottom: 10px;
  font-family: "pretendardR";
`;

const StyledLink = styled(Link)`
  font-family: "pretendardR";
  color: var(--gray-color3);
  font-size: 14px;
  text-decoration: none;
  border: 2px solid var(--gray-color2);
  border-radius: 8px;
  padding: 4px;

  &:hover {
    background-color: var(--gray-color1);
  }
`;

const StyledMyInfoButton = styled(Button)`
  display: flex;
  width: 140px;
  height: 32px;
  gap: 10px;
  background-color: var(--yellow-color1);
  color: var(--black-color);
  font-size: 12px;
  font-style: normal;
`;

const MyInfoMain = () => {
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    road_address: "",
    detail_address: "",
    profile_image: "",
    total_distance: "0.0",
    total_kilocalories: "0.0",
  });

  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo({
          nickname: data.nickname,
          road_address: data.road_address,
          detail_address: data.detail_address,
          profile_image: data.profile_image,
          total_distance: data.total_distance,
          total_kilocalories: data.total_kilocalories,
        });
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    const fetchDogs = async () => {
      try {
        const response = await authApi.get("/dogs/all");
        setDogs(response.data.dogs);
      } catch (error) {
        console.error("Failed to fetch dogs:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchUserInfo(), fetchDogs()]);
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <UserInfo>
        <StyledImage src={userInfo.profile_image} alt="Profile" />
        <SectionTitle>{userInfo.nickname}님, 안녕하세요!</SectionTitle>
        지금까지 총 {userInfo.total_distance}km 산책하고{" "}
        {userInfo.total_kilocalories}kcal를 소비했네요.
      </UserInfo>
      <StyledLink to="/myinfo-edit">+ 내 정보 수정</StyledLink>

      <MyInfoButtonContainer>
        <StyledMyInfoButton text="내 산책현황" />
        <StyledMyInfoButton text="칭호관리" />
        <StyledMyInfoButton text="내가남긴 리뷰" />
        <StyledMyInfoButton text="내가 받은 리뷰" />
      </MyInfoButtonContainer>

      <MyDogInfoContainer>
        <p>내가 등록한 강아지</p>
        <StyledLink to="/dogs/new">+ 강아지 등록</StyledLink>
      </MyDogInfoContainer>
      {dogs.length === 0 ? (
        <p>등록된 강아지가 없습니다.</p>
      ) : (
        dogs.map((dog) => (
          <DogInfo
            key={dog.id}
            id={dog.id}
            name={dog.name}
            gender={dog.gender}
            age={dog.age}
            introduction={dog.introduction}
            status={dog.status}
            image={dog.image}
          />
        ))
      )}
      <Footer />
    </>
  );
};

export default MyInfoMain;
