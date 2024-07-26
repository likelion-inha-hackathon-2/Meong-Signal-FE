import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import Image from "../../components/Image/Image";
import DogInfo from "../../components/Dog/DogInfo";
import { getUserInfo } from "../../apis/getUserInfo";
import authApi from "../../apis/authApi";
import { useNavigate } from "react-router-dom";

const StyledImage = styled(Image)``;

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

const MyDogInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const MyDogInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 90px;
  margin-bottom: 10px;
  font-family: "pretendardB";
`;

const DogInfoText = styled.div`
  margin-bottom: 10px;
  font-family: "pretendardR";
  color: var(--balck-color);
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

// 내 정보 수정, 강아지 등록
const StyledLinkButton = styled(Button)`
  font-family: "PretendardR";
  color: var(--gray-color1);
  font-size: 14px;
  text-decoration: none;
  border: 1px solid var(--gray-color2);
  width: 100px;
  height: 30px;
  border-radius: 4px;
  padding: 4px;
  display: inline-block;
  text-align: center;
  background-color: var(--gray-color1);
  color: var(--black-color);

  &:hover {
    background-color: var(--gray-color2);
  }
`;

const MyInfoMain = () => {
  const navigate = useNavigate();
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
  }, []); // 컴포넌트 마운트 시에만 호출되도록 변경

  const onClickMyWalk = () => {
    navigate("/walk-my-record");
  };
  const onClickGoalStatus = () => {
    navigate("/achievement");
  };
  const onClickReviewReceived = () => {
    navigate("/reviews/received");
  };
  const onClickReviewWritten = () => {
    navigate("/reviews/written");
  };

  return (
    <>
      <Header />
      <UserInfo>
        <StyledImage
          src={userInfo.profile_image}
          alt="Profile"
          width="150px"
          height="150px"
        />
        <SectionTitle>{userInfo.nickname}님, 안녕하세요!</SectionTitle>
        지금까지 총 {userInfo.total_distance}km 산책하고{" "}
        {userInfo.total_kilocalories}kcal를 소비했네요.
      </UserInfo>
      <StyledLinkButton
        text="+ 내 정보 수정"
        onClick={() => navigate("/myinfo-edit")}
      ></StyledLinkButton>

      <MyInfoButtonContainer>
        <StyledMyInfoButton text="내 산책현황" onClick={onClickMyWalk} />
        <StyledMyInfoButton text="칭호관리" onClick={onClickGoalStatus} />
        <StyledMyInfoButton
          text="내가 남긴 리뷰"
          onClick={onClickReviewWritten}
        />
        <StyledMyInfoButton
          text="내가 받은 리뷰"
          onClick={onClickReviewReceived}
        />
      </MyInfoButtonContainer>

      <MyDogInfoWrapper>
        <MyDogInfoContainer>
          <p>내가 등록한 강아지</p>
          <StyledLinkButton
            text="+ 강아지 등록"
            onClick={() => navigate("/dogs-new")}
          ></StyledLinkButton>
        </MyDogInfoContainer>
        <DogInfoText>강아지 사진을 클릭해 산책 기록을 조회하세요!</DogInfoText>
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
      </MyDogInfoWrapper>

      <Footer />
    </>
  );
};

export default MyInfoMain;
