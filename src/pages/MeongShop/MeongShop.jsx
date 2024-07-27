import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useForm from "../../hooks/useForm";
import IconFoot from "../../assets/icons/icon-dogfootprint.png";
import Goods from "../../components/Goods/Goods";
import IconSearch from "../../assets/icons/icon-search.png";
import IconCart from "../../assets/icons/icon-cart.png";
import { useNavigate } from "react-router-dom";
import { getMyMeong } from "../../apis/meong";
import { getProducts, purchaseProduct } from "../../apis/goodsApi";

const Title = styled.span`
  font-family: "PretendardB";
  font-size: 24px;
  text-align: left;
`;

const SubText = styled.span`
  opacity: 1;
  font-family: "PretendardR";
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  text-align: left;
  color: var(--gray-color3);
  margin-bottom: 10px;
`;

const IconFootprint = styled.img`
  width: 24px;
  height: 24px;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
`;

const SubTextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10px;
`;

const Bar = styled.div`
  width: 320px;
  height: 28px;
  margin: 10px 0;
  border-radius: 20px;
  background-color: var(--gray-color1);
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

const SearchImage = styled.img`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CartImage = styled.img`
  width: 28px;
  height: 35px;
  cursor: pointer;
`;

const GoodsTypeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "PretendardM";
  font-size: 12px;
  margin-bottom: 10px;
`;

const GoodsTypeText = styled.div`
  font-family: "PretendardS";
  font-size: 16px;
  text-align: left;
  margin-top: 2px;
`;

const GoodsContainerWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const SlimBar = styled.div`
  width: 100%;
  height: 1px;
  margin: 10px 0;
  background-color: var(--gray-color2);
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "PretendardR";
  font-size: 14px;
  width: 100%;
  padding: 0 10px;
  margin-bottom: 20px;
`;

const NoGoodsText = styled.span`
  font-family: PretendardM;
  font-size: 12px;
  color: var(--gray-color3);
  margin: 10px 0;
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background-color: transparent;
  font-family: "PretendardR";
`;

const MeongShop = () => {
  const [dogSnackGoods, setDogSnackGoods] = useState([]);
  const [customGoods, setCustomGoods] = useState([]);
  const [normalGoods, setNormalGoods] = useState([]);
  const [dogSnackError, setDogSnackError] = useState(null);
  const [customGoodsError, setCustomGoodsError] = useState(null);
  const [normalGoodsError, setNormalGoodsError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [meong, setMeong] = useState(0);
  const { values, handleChange } = useForm({ searchTerm: "" });
  const navigate = useNavigate();

  const fetchGoods = async () => {
    try {
      const dogSnackData = await getProducts("D");
      setDogSnackGoods(dogSnackData);
      setDogSnackError(null);
    } catch (error) {
      setDogSnackGoods([]);
      setDogSnackError("카테고리에 아직 상품이 없어요.");
    }

    try {
      const customGoodsData = await getProducts("C");
      setCustomGoods(customGoodsData);
      setCustomGoodsError(null);
    } catch (error) {
      setCustomGoods([]);
      setCustomGoodsError("카테고리에 아직 상품이 없어요.");
    }

    try {
      const normalGoodsData = await getProducts("N");
      setNormalGoods(normalGoodsData);
      setNormalGoodsError(null);
    } catch (error) {
      setNormalGoods([]);
      setNormalGoodsError("카테고리에 아직 상품이 없어요.");
    }
  };

  useEffect(() => {
    fetchGoods();
    const fetchMeong = async () => {
      try {
        const response = await getMyMeong();
        setMeong(response.current_meong);
      } catch (error) {
        console.error("Error fetching 멍:", error);
      }
    };
    fetchMeong();
  }, []);

  useEffect(() => {
    if (values.searchTerm === "") {
      fetchGoods();
    }
  }, [values.searchTerm]);

  const handleSearch = () => {
    const filterGoods = (goods) =>
      goods.filter((item) => item.name.includes(values.searchTerm));

    if (values.searchTerm) {
      setDogSnackGoods(filterGoods(dogSnackGoods));
      setCustomGoods(filterGoods(customGoods));
      setNormalGoods(filterGoods(normalGoods));
    } else {
      fetchGoods();
    }
  };

  const handlePurchase = async (productId) => {
    try {
      const response = await purchaseProduct(productId);
      if (response.message === "Product purchased successfully.") {
        alert("상품이 성공적으로 구매되었습니다.");
        setMeong(response.current_meong);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        if (
          error.response.data.error ===
          "Not enough meong to purchase the product."
        ) {
          alert("멍이 부족합니다.");
        } else if (error.response.data.error === "이미 구매하신 상품입니다.") {
          alert("이미 구매하신 상품입니다.");
        } else {
          alert("상품 구매 중 오류가 발생했습니다.");
        }
      } else {
        alert("상품 구매 중 오류가 발생했습니다.");
      }
    }
  };

  const handleCartClick = () => {
    navigate("/my-goods");
  };

  return (
    <>
      <Header />
      <FlexContainer>
        <IconFootprint src={IconFoot} />
        <Title>멍 SHOP</Title>
      </FlexContainer>
      <SubTextContainer>
        <SubText>멍으로 강쥐 굿즈를 구매해보세요!</SubText>
        <CartImage src={IconCart} onClick={handleCartClick} />
      </SubTextContainer>
      <Bar>
        <StyledInput
          type="text"
          name="searchTerm"
          value={values.searchTerm}
          onChange={handleChange}
          placeholder="상품을 검색하세요."
        />
        <SearchImage src={IconSearch} onClick={handleSearch} />
      </Bar>
      <CategoryContainer>
        <GoodsTypeContainer>
          <GoodsTypeText>🥫 애견 간식</GoodsTypeText>
        </GoodsTypeContainer>
        {dogSnackError ? (
          <NoGoodsText>{dogSnackError}</NoGoodsText>
        ) : (
          <GoodsContainerWrapper>
            {dogSnackGoods.map((item) => (
              <Goods
                key={item.id}
                item={item}
                handlePurchase={handlePurchase}
              />
            ))}
          </GoodsContainerWrapper>
        )}
        <SlimBar />
        <GoodsTypeContainer>
          <GoodsTypeText>🧶 주문제작 상품</GoodsTypeText>
        </GoodsTypeContainer>
        {customGoodsError ? (
          <NoGoodsText>{customGoodsError}</NoGoodsText>
        ) : (
          <GoodsContainerWrapper>
            {customGoods.map((item) => (
              <Goods
                key={item.id}
                item={item}
                handlePurchase={handlePurchase}
              />
            ))}
          </GoodsContainerWrapper>
        )}
        <SlimBar />
        <GoodsTypeContainer>
          <GoodsTypeText>🔎 일반 상품</GoodsTypeText>
        </GoodsTypeContainer>
        {normalGoodsError ? (
          <NoGoodsText>{normalGoodsError}</NoGoodsText>
        ) : (
          <GoodsContainerWrapper>
            {normalGoods.map((item) => (
              <Goods
                key={item.id}
                item={item}
                handlePurchase={handlePurchase}
              />
            ))}
          </GoodsContainerWrapper>
        )}
      </CategoryContainer>
      <Footer />
    </>
  );
};

export default MeongShop;
