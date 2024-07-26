import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "../Image/Image";
import { useNavigate } from "react-router-dom";
import { getMyMeong } from "../../apis/meong";
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
  gap: 8px;
  border-radius: 16px;
  background-color: #ffffff;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 56px;
  background-color: var(--yellow-color1);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  position: fixed;
  top: 0;
  z-index: 100;
  padding: 0 16px;
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
  margin: 0 3px;
  font-family: "pretendardB";
`;

const Header = () => {
  const [meong, setMeong] = useState(0);
  const navigate = useNavigate();

  const fetchMeong = async () => {
    try {
      const response = await getMyMeong();
      setMeong(response.current_meong);
    } catch (error) {
      console.error("Error fetching 멍:", error);
    }
  };

  useEffect(() => {
    fetchMeong();
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleNumberClick = () => {
    navigate("/number-page");
  };

  const handlePluscoinClick = () => {
    navigate("/topup");
  };

  return (
    <HeaderWrapper>
      <IconWrapper onClick={handleBackClick}>
        <ArrowImage src={ArrowIcon} alt="Back" />
      </IconWrapper>
      <ButtonWrapper>
        <IconImage src={Dogfoot} alt="dog" />
        <NumberText onClick={handleNumberClick}>{meong}</NumberText>
        <IconWrapper onClick={handlePluscoinClick}>
          <IconImage src={Pluscoin} alt="Plus" />
        </IconWrapper>
      </ButtonWrapper>
    </HeaderWrapper>
  );
};

export default Header;
