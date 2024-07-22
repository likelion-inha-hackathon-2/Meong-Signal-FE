import React from "react";
import styled from "styled-components";
import Image from "../Image/Image";
import { useNavigate } from "react-router-dom";
import ArrowIcon from "../../assets/icons/icon-arrow.png";
import Pluscoin from "../../assets/icons/icon-plus.png";
import Dogfoot from "../../assets/icons/icon-dogfootprint.png";

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112px;
  height: 39px;
  top: 11px;
  left: 192px;
  margin:0
  gap: 8px;
  border-radius: 16px;
  background-color: #ffffff;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between; /* 아이템들을 양 끝으로 정렬 */
  align-items: center;
  width: 100%;
  height: 56px;
  background-color: #ffe8ad;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  position: fixed;
  top: 0;
  z-index: 100;
  padding: 0 16px; /* 좌우 패딩 추가 */
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const IconImage = styled(Image)`
  width: 17px;
  height: 17px;
`;
const ArrowImage = styled.img`
  width: 30px;
  height: 30px;
`;

const NumberText = styled.span`
  font-size: 16px;
  margin: 0 8px; /* 좌우 간격을 주어 아이콘과 텍스트 사이를 벌림 */
  font-family: "pretendardB";
`;

const Header = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // 뒤로 가기
  };

  const handleNumberClick = () => {
    navigate("/number-page"); // 숫자 클릭 시 이동할 페이지 경로
  };

  const handlePluscoinClick = () => {
    navigate("/topup"); // 오른쪽 아이콘 클릭 시 이동할 페이지 경로
  };

  return (
    <HeaderWrapper>
      <IconWrapper onClick={handleBackClick}>
        <ArrowImage src={ArrowIcon} alt="Back" />
      </IconWrapper>
      <ButtonWrapper>
        <IconImage src={Dogfoot} alt="dog" />
        <NumberText onClick={handleNumberClick}>300</NumberText>
        <IconWrapper onClick={handlePluscoinClick}>
          <IconImage src={Pluscoin} alt="Plus" />
        </IconWrapper>
      </ButtonWrapper>
    </HeaderWrapper>
  );
};

export default Header;
