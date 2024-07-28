import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Foot from "../assets/icons/icon-dogfootprint.png";
import Plus from "../assets/icons/icon-plus.png";
import FilterIcon from "../assets/icons/icon-filter.png";
import EllipseIcon from "../assets/icons/icon-ellipse.png";
import FootWhite from "../assets/icons/icon-Footprint-white.png";

const PriceButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 29px; /* Increased width to accommodate text and icon */
  height: 12px; /* Adjusted height */
  border-radius: 4px;
  background-color: #ffb800;
`;

const Title = styled.span`
  font-family: PretendardB;
  font-size: 25px;
  text-align: left;
`;

const SubText = styled.span`
  width: 132px;
  height: 28px;
  opacity: 1; /* 텍스트가 보이도록 수정 */
  font-family: PretendardL;
  font-size: 10px;
  font-weight: 600;
  line-height: 28px;
  text-align: left;
  color: #868686;
`;

const PlusImage = styled.img`
  width: 9px;
  height: 9px;
  padding-top: 0;
`;

const FootImage = styled.img`
  width: 30px;
  height: 30px;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 10px; /* 요소 간의 간격 */
  padding: 20px; /* 컨테이너 패딩 */
`;

const Bar = styled.div`
  width: 285px;
  height: 24px;
  margin: 10px auto; /* 수평 중앙 정렬 */
  border-radius: 20px;
  background-color: #eeeeee;
  display: flex; /* Flexbox 사용 */
  align-items: center;
  justify-content: space-between; /* 좌우 끝으로 배치 */
  padding: 0 10px; /* 좌우 패딩 */
`;

const FilterImage = styled.img`
  width: 9px;
  height: 9px;
`;

const EllipseImage = styled.img`
  width: 18px;
  height: 18px;
`;

const GoodsTypeContainer = styled.div`
  display: flex;
  align-items: center;
  width: 285px;
  height: 12px;
  opacity: 1; /* 요소가 보이도록 변경 */
  font-family: PretendardM;
  font-size: 8px;
  margin: 0;
  text-align: left;
  display: flex; /* Flexbox 사용 */
  color: #000000; /* 텍스트 색상 추가 */
`;

const GoodsTypeText = styled.span`
  font-family: PretendardM;
  font-size: 8px;
  color: #000000;
`;

const SnackContainer = styled.div`
  width: 136px;
  height: 58px;
  gap: 0px;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  padding: 10px;
`;

const GoodsPicture = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const GoodsName = styled.span`
  width: 63px;
  height: 18px;
  opacity: 1;
  font-family: PretendardB;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: -0.011em;
  text-align: left;
`;

const GoodsInfo = styled.span`
  font-family: PretendardL;
  font-size: 6px;
  color: #868686;
  margin-bottom: 3px;
`;

const GoodsInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SnackContainerWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columns */
  gap: 10px;
  margin-top: 20px;
`;

const SlimBar = styled.div`
  width: 285px;
  height: 1px;
  margin: 20px auto; /* 수평 중앙 정렬 및 위아래 마진 추가 */
  background-color: #d2d2d2;
`;

const PriceText = styled.span`
  font-family: PretendardB;
  font-size: 8px; /* Adjusted font size */
  color: white;
  text-align: left;
  margin-right: 2px;
`;

const FootWhiteImage = styled.img`
  width: 7px; /* Adjusted size */
  height: 8px;
`;

const Goods = () => {
  return (
    <>
      <Header />
      <FlexContainer>
        <FootImage src={Foot} />
        <div>
          <Title>멍 SHOP</Title>
          <SubText style={{ marginLeft: "30px" }}>
            멍으로 강쥐 굿즈를 구매해보세요!
          </SubText>
        </div>
      </FlexContainer>
      <Bar>
        <FilterImage src={FilterIcon} />
        <EllipseImage src={EllipseIcon} />
      </Bar>
      <GoodsTypeContainer>
        <GoodsTypeText>애견 간식 | 애견 용품</GoodsTypeText>
        <PlusImage src={Plus} />
      </GoodsTypeContainer>
      <SnackContainerWrapper>
        <SnackContainer>
          <GoodsPicture src={Foot} />
          <GoodsInfoContainer>
            <GoodsName>강쥐 덴탈껌</GoodsName>
            <GoodsInfo>우리 강쥐를 위한 구강케어</GoodsInfo>
            <PriceButton>
              <PriceText>100</PriceText>
              <FootWhiteImage src={FootWhite} alt="발바닥" />
            </PriceButton>
          </GoodsInfoContainer>
        </SnackContainer>
        <SnackContainer>
          <GoodsPicture src={Foot} />
          <GoodsInfoContainer>
            <GoodsName>강쥐 덴탈껌</GoodsName>
            <GoodsInfo>우리 강쥐를 위한 구강케어</GoodsInfo>
            <PriceButton>
              <PriceText>100</PriceText>
              <FootWhiteImage src={FootWhite} alt="발바닥" />
            </PriceButton>
          </GoodsInfoContainer>
        </SnackContainer>
        <SnackContainer>
          <GoodsPicture src={Foot} />
          <GoodsInfoContainer>
            <GoodsName>강쥐 덴탈껌</GoodsName>
            <GoodsInfo>우리 강쥐를 위한 구강케어</GoodsInfo>
            <PriceButton>
              <PriceText>100</PriceText>
              <FootWhiteImage src={FootWhite} alt="발바닥" />
            </PriceButton>
          </GoodsInfoContainer>
        </SnackContainer>
        <SnackContainer>
          <GoodsPicture src={Foot} />
          <GoodsInfoContainer>
            <GoodsName>강쥐 덴탈껌</GoodsName>
            <GoodsInfo>우리 강쥐를 위한 구강케어</GoodsInfo>
            <PriceButton>
              <PriceText>100</PriceText>
              <FootWhiteImage src={FootWhite} alt="발바닥" />
            </PriceButton>
          </GoodsInfoContainer>
        </SnackContainer>
      </SnackContainerWrapper>
      <SlimBar />
      <GoodsTypeContainer>
        <GoodsTypeText>주문제작 상품</GoodsTypeText>
        <PlusImage src={Plus} />
      </GoodsTypeContainer>

      <SnackContainerWrapper>
        <SnackContainer>
          <GoodsPicture src={Foot} />
          <GoodsInfoContainer>
            <GoodsName>PE 케이스</GoodsName>
            <GoodsInfo>우리 강쥐가 폰케이스에?</GoodsInfo>
            <PriceButton>
              <PriceText>100</PriceText>
              <FootWhiteImage src={FootWhite} alt="발바닥" />
            </PriceButton>
          </GoodsInfoContainer>
        </SnackContainer>
        <SnackContainer>
          <GoodsPicture src={Foot} />
          <GoodsInfoContainer>
            <GoodsName>PE 케이스</GoodsName>
            <GoodsInfo>우리 강쥐가 폰케이스에?</GoodsInfo>
            <PriceButton>
              <PriceText>100</PriceText>
              <FootWhiteImage src={FootWhite} alt="발바닥" />
            </PriceButton>
          </GoodsInfoContainer>
        </SnackContainer>
        <SnackContainer>
          <GoodsPicture src={Foot} />
          <GoodsInfoContainer>
            <GoodsName>PE 케이스</GoodsName>
            <GoodsInfo>우리 강쥐가 폰케이스에?</GoodsInfo>
            <PriceButton>
              <PriceText>100</PriceText>
              <FootWhiteImage src={FootWhite} alt="발바닥" />
            </PriceButton>
          </GoodsInfoContainer>
        </SnackContainer>
        <SnackContainer>
          <GoodsPicture src={Foot} />
          <GoodsInfoContainer>
            <GoodsName>PE 케이스</GoodsName>
            <GoodsInfo>우리 강쥐가 폰케이스에?</GoodsInfo>
            <PriceButton>
              <PriceText>100</PriceText>
              <FootWhiteImage src={FootWhite} alt="발바닥" />
            </PriceButton>
          </GoodsInfoContainer>
        </SnackContainer>
      </SnackContainerWrapper>
      <SlimBar />
      <GoodsTypeContainer>
        <GoodsTypeText>일반 상품</GoodsTypeText>
        <PlusImage src={Plus} />
      </GoodsTypeContainer>
      <Footer />
    </>
  );
};

export default Goods;
