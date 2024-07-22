import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Icon from "../assets/icons/icon-dogfootprint.png";

const Mine = styled.span`
  font-family: PretendardR;
  font-size: 14px;
  font-weight: 700;
  line-height: 28px;
  text-align: center;
`;

const Info = styled.span`
  width: 300px;
  height: 28px;
  gap: 0px;
  opacity: 0px;
  font-family: PretendardR;
  font-size: 10px;
  font-weight: 600;
  line-height: 28px;
  text-align: center;
  color: #868686;
`;

const Number = styled.span`
  font-family: PretendardB;
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
  background-color: #ffffff; /* 내부 배경색을 흰색으로 설정 */
  border: 6px solid #ffe8ad; /* 테두리를 지정된 색상으로 설정하고 두께를 6px로 설정 */
  color: #000000; /* 텍스트 색상 설정 */
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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
  const navigate = useNavigate();

  const handleBoxClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <Header />
      <Mine>보유멍</Mine>
      <TopContainer>
        <Number>300</Number>
        <IconStyled src={Icon} alt="Dog Footprint Icon" />
      </TopContainer>

      <Info>지금 바로 멍을 충전하여 다양한 기능을 이용해보세요!</Info>
      <Container>
        <BoxNumber>10</BoxNumber>
        <SmallIconStyled src={Icon} />
        <Box onClick={() => handleBoxClick("/path1")}>
          <BoxPrice>1,000원</BoxPrice>
        </Box>
      </Container>
      <Container>
        <BoxNumber>50</BoxNumber>
        <SmallIconStyled src={Icon} />
        <Box onClick={() => handleBoxClick("/path2")}>
          <BoxPrice>5,000원</BoxPrice>
        </Box>
      </Container>
      <Container>
        <BoxNumber style={{ marginLeft: "12px" }}>100</BoxNumber>
        <SmallIconStyled src={Icon} style={{ marginLeft: "15px" }} />
        <Box onClick={() => handleBoxClick("/path3")}>
          <BoxPrice>9,000원</BoxPrice>
        </Box>
      </Container>
      <Container>
        <BoxNumber style={{ marginLeft: "12px" }}>300</BoxNumber>
        <SmallIconStyled src={Icon} style={{ marginLeft: "16px" }} />
        <Box onClick={() => handleBoxClick("/path4")}>
          <BoxPrice>25,000원</BoxPrice>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default TopUp;
