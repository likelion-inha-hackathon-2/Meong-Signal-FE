import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import FootWhite from "../../assets/icons/icon-footprint-white.png";

const GoodsContainer = styled.div`
  width: 160px;
  gap: 0px;
  border-radius: 10px;
  border: 4px solid var(--yellow-color1);
  display: flex;
  align-items: center;
  padding: 6px;
  margin-bottom: 10px; /* 추가된 여백 */
`;

const GoodsPicture = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 8px;
  border-radius: 4px;
`;

const GoodsName = styled.span`
  width: 100%;
  opacity: 1;
  font-family: "PretendardB";
  font-size: 14px;
  font-weight: 600;
  line-height: 14px;
  text-align: left;
  margin-bottom: 2px;
`;

const GoodsInfo = styled.span`
  font-family: "PretendardL";
  font-size: 10px;
  color: var(--gray-color3);
  margin-bottom: 4px;
`;

const GoodsInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

// 멍 구매 버튼
const PriceButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 24px;
  border-radius: 4px;
  background-color: var(--yellow-color2);
  cursor: pointer;
  padding: 2px 4px;
  &:hover {
    background-color: var(--yellow-color3);
  }
`;

const PriceText = styled.span`
  font-family: "PretendardB";
  font-size: 12px;
  color: white;
  text-align: left;
  margin-right: 2px;
`;

const Goods = ({ item, handlePurchase }) => (
  <GoodsContainer>
    <GoodsPicture src={item.image} alt={item.name} />
    <GoodsInfoContainer>
      <GoodsName>{item.name}</GoodsName>
      <GoodsInfo>{item.content}</GoodsInfo>
      <PriceButton onClick={() => handlePurchase(item.id, item.price)}>
        <PriceText>{item.price}</PriceText>
        <img
          src={FootWhite}
          alt="발바닥"
          style={{ width: "14px", height: "14px" }} /* 이미지 크기 증가 */
        />
      </PriceButton>
    </GoodsInfoContainer>
  </GoodsContainer>
);

Goods.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    content: PropTypes.string,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  handlePurchase: PropTypes.func.isRequired,
};

export default Goods;
