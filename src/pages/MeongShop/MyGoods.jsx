import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getMyProducts } from "../../apis/goodsApi";

const Title = styled.span`
  font-family: "PretendardB";
  font-size: 24px;
  margin-top: 20px;
  margin-left: 10px;
`;

const GoodsContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const NoGoodsText = styled.span`
  font-family: "PretendardM";
  font-size: 12px;
  color: var(--gray-color3);
  margin: 10px 0;
  text-align: center;
`;

const ProductBox = styled.div`
  width: 100%;
  max-width: 150px;
  border-radius: 10px;
  border: 3px solid var(--yellow-color2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff; /* 배경색 추가 */
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 8px;
  border-radius: 10px;
`;

const ProductName = styled.span`
  font-family: "PretendardB";
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 4px;
`;

const ProductContent = styled.span`
  font-family: "PretendardL";
  font-size: 10px;
  color: #868686;
  text-align: center;
`;

const MyGoods = () => {
  const [myGoods, setMyGoods] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const response = await getMyProducts();
        setMyGoods(response.my_products);
        setError(null);
      } catch (error) {
        setMyGoods([]);
        setError("아직 구매한 상품이 없어요.");
      }
    };

    fetchMyProducts();
  }, []);

  return (
    <>
      <Header />
      <Title>내가 구매한 굿즈 목록</Title>
      {error ? (
        <NoGoodsText>{error}</NoGoodsText>
      ) : (
        <GoodsContainerWrapper>
          {myGoods.map((item) => (
            <ProductBox key={item.name}>
              <ProductImage src={item.image} alt={item.name} />
              <ProductName>{item.name}</ProductName>
              <ProductContent>{item.content}</ProductContent>
            </ProductBox>
          ))}
        </GoodsContainerWrapper>
      )}
      <Footer />
    </>
  );
};

export default MyGoods;
