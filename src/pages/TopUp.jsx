import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import FootPrintIcon from "../assets/icons/icon-dogfootprint.png";
import { getMyMeong, addMyMeong } from "../apis/meong";

const TitleSection = styled.span`
  font-family: "PretendardB";
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  text-align: center;
`;

const Info = styled.span`
  width: 300px;
  height: 28px;
  gap: 0px;
  opacity: 0px;
  font-family: "PretendardR";
  font-size: 12px;
  font-weight: 600;
  line-height: 28px;
  text-align: center;
  color: var(--gray-color3);
`;

const Number = styled.span`
  font-family: "PretendardB";
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  text-align: center;
`;

const Box = styled.span`
  width: 61px;
  height: 32px;
  float: right;
  margin-right: 10px;
  margin-top: 10px;
  gap: 0px;
  border-radius: 4px;
  opacity: 0px;
  background: #ffb800;
  text-align: center;
  padding-top: 5px;
  cursor: pointer;
`;

const BoxPrice = styled.span`
  width: 37px;
  height: 15px;
  top: 192px;
  left: 240px;
  gap: 0px;
  opacity: 0px;
  font-family: PretendardB;
  font-size: 10px;
  font-weight: bold;
  line-height: 15px;
  letter-spacing: -0.011em;
  text-align: left;
`;

const BoxNumber = styled.div`
  width: 21px;
  height: 28px;
  margin-top: 10px;
  margin-left: 20px;
  gap: 0px;
  opacity: 0px;
  font-family: PretendardB;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  text-align: center;
  float: left;
`;

const Container = styled.div`
  width: 290px;
  height: 64px;
  top: 168px;
  left: 15px;
  gap: 0px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 6px solid var(--yellow-color1);
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;
`;

const IconStyled = styled.img`
  width: 30px;
  height: 30px;
  margin-left: 10px;
`;

const SmallIconStyled = styled.img`
  width: 21px;
  height: 19px;
  margin-top: 14.5px;
  margin-left: 2px;
`;

const TopUp = () => {
  const [meong, setMeong] = useState(0);

  const handleBoxClick = async (add_meong) => {
    try {
      await addMyMeong(add_meong);
      alert("충전이 완료되었습니다!");
      // 충전 후 보유 멍 업데이트
      const response = await getMyMeong();
      setMeong(response.current_meong);
    } catch (error) {
      alert("충전 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const fetchMeong = async () => {
      try {
        const response = await getMyMeong();
        setMeong(response.current_meong);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMeong();
  }, []);

  return (
    <>
      <Header />
      <TitleSection>보유멍</TitleSection>
      <TopContainer>
        <Number>{meong}</Number>
        <IconStyled src={FootPrintIcon} alt="Dog Footprint Icon" />
      </TopContainer>
      <Info>지금 바로 멍을 충전하여 다양한 기능을 이용해보세요!</Info>
      <Container>
        <BoxNumber>10</BoxNumber>
        <SmallIconStyled src={FootPrintIcon} />
        <Box onClick={() => handleBoxClick(10)}>
          <BoxPrice>1,000원</BoxPrice>
        </Box>
      </Container>
      <Container>
        <BoxNumber>50</BoxNumber>
        <SmallIconStyled src={FootPrintIcon} />
        <Box onClick={() => handleBoxClick(50)}>
          <BoxPrice>5,000원</BoxPrice>
        </Box>
      </Container>
      <Container>
        <BoxNumber style={{ marginLeft: "12px" }}>100</BoxNumber>
        <SmallIconStyled src={FootPrintIcon} style={{ marginLeft: "15px" }} />
        <Box onClick={() => handleBoxClick(100)}>
          <BoxPrice>9,000원</BoxPrice>
        </Box>
      </Container>
      <Container>
        <BoxNumber style={{ marginLeft: "12px" }}>300</BoxNumber>
        <SmallIconStyled src={FootPrintIcon} style={{ marginLeft: "16px" }} />
        <Box onClick={() => handleBoxClick(300)}>
          <BoxPrice>25,000원</BoxPrice>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default TopUp;
