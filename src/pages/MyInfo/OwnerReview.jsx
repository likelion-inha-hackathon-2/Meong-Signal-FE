import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { createOwnerReview } from "../../apis/review";
import { getUserImageAndName } from "../../apis/walk";
import Image from "../../components/Image/Image";
import Button from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Rate from "../../components/Rate/Rate";

const Container = styled.div`
  width: 350px;
  padding: 30px;
  margin: 0 auto;
  font-family: "PretendardM";
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 20px;
  border-radius: 50%;
  justify-content: center;
`;

const UserImage = styled(Image)`
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
`;

const UserName = styled.p`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: bold;
  width: 70px;
`;

const TextArea = styled.textarea`
  height: 70px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid var(--gray-color2);
  font-family: "PretendardR";
  font-size: 14px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid var(--gray-color2);
  font-family: "PretendardR";
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const OwnerReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { walkId } = location.state || {};
  const [walkDetails, setWalkDetails] = useState(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [meong, setMeong] = useState(5);

  useEffect(() => {
    const fetchWalkDetails = async () => {
      try {
        const data = await getUserImageAndName(walkId);
        setWalkDetails(data);
      } catch (error) {
        console.error("Error fetching walk details:", error);
      }
    };

    fetchWalkDetails();
  }, [walkId]);

  // 리뷰 작성
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOwnerReview({ walk_id: walkId, rating, content, meong });
      alert("리뷰 작성이 완료되었습니다.");
      navigate("/myinfo-main");
    } catch (error) {
      console.error("Error creating review:", error);
      alert("리뷰 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header />
      <Container>
        {walkDetails && (
          <UserName>{walkDetails.user_name}님은 어떠셨나요?</UserName>
        )}
        {walkDetails && (
          <>
            <UserInfo>
              <UserImage
                src={walkDetails.user_image}
                width="120px"
                height="120px"
                alt="프로필 사진"
              />
            </UserInfo>
          </>
        )}
        <Form onSubmit={handleSubmit}>
          <FieldContainer>
            <Label>별점:</Label>
            <Rate value={rating} onChange={setRating} />
          </FieldContainer>
          <FieldContainer>
            <Label>리뷰 내용:</Label>
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </FieldContainer>
          <FieldContainer>
            <Label>멍 선물:</Label>
            <Select
              value={meong}
              onChange={(e) => setMeong(Number(e.target.value))}
            >
              {[...Array(20).keys()].map((i) => (
                <option key={i} value={i * 5}>
                  {i * 5}멍
                </option>
              ))}
            </Select>
          </FieldContainer>
          <ButtonContainer>
            <Button text="리뷰 작성" type="submit" />
          </ButtonContainer>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default OwnerReview;
