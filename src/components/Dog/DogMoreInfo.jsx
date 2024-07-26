import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Image from "../Image/Image";
import tagsData from "../Tag/tagsData.json";
import Button from "../Button/Button";
import authApi from "../../apis/authApi";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import { createChatRoom } from "../../apis/chatApi"; // chatApi 임포트
import defaultDogImage from "../../assets/images/add-dog.png"; // 디폴트 이미지 예외처리

const TooltipContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: 250px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 200;
  font-family: "PretendardM";
  gap: 2px;
`;

const Tag = styled.span`
  margin: 0 5px;
  padding: 5px;
  background-color: #eee;
  border-radius: 4px;
  font-size: 12px;
`;

// 보호자와 채팅하기
const StyledButton = styled(Button)`
  font-size: 14px;
  width: 150px;
`;

// 툴팁 닫기 버튼
const CloseButton = styled.button`
  width: 70px;
  margin-top: 5px;
  padding: 5px 10px;
  background-color: #f5f5f5;
  border: 1px solid var(--gray-color1);
  border-radius: 4px;
  cursor: pointer;
  font-family: "PretendardR";
  &:hover {
    background-color: #e0e0e0;
  }
`;

const DogMoreInfo = ({ dogId, onClose }) => {
  const [dog, setDog] = useState(null);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchDogInfo = async () => {
      try {
        const dogResponse = await authApi.get(`/dogs/${dogId}`);
        const tagsResponse = await authApi.get(`/dogs/${dogId}/tags`);
        setDog(dogResponse.data.dog);
        setTags(tagsResponse.data.tags);
      } catch (error) {
        console.error("Error fetching dog info:", error);
      }
    };

    fetchDogInfo();
  }, [dogId]);

  if (!dog) {
    return null;
  }

  // 태그 id 매칭
  const getTagInfo = (tagId) => tagsData.find((tag) => tag.id === tagId);

  const handleContactButtonClick = async () => {
    try {
      // 견주 아이디, 사용자 아이디를 파라미터로 넣어야 함
      const response = await createChatRoom(dog.owner_id, 1);
      if (response && response.room_id) {
        navigate(`/chat/${response.room_id}`);
      } else {
        console.error("Failed to create chat room");
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
    }
  };

  return (
    <TooltipContainer>
      <Image
        src={dog.image || defaultDogImage}
        alt={dog.name}
        width="70px"
        height="70px"
      />
      <h3>이름: {dog.name}</h3>
      <p>성별: {dog.gender === "M" ? "남" : "여"}</p>
      <p>나이: {dog.age}살</p>
      <p>소개: {dog.introduction}</p>
      <div>
        {tags.slice(0, 2).map((tag) => {
          const tagInfo = getTagInfo(tag.number);
          return (
            <Tag key={tag.number}>
              {tagInfo ? `${tagInfo.emoji} ${tagInfo.label}` : `#${tag.number}`}
            </Tag>
          );
        })}
      </div>
      <StyledButton
        text="💌보호자와 채팅하기"
        onClick={handleContactButtonClick}
      />
      <CloseButton onClick={onClose}>닫기</CloseButton>
    </TooltipContainer>
  );
};

DogMoreInfo.propTypes = {
  dogId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DogMoreInfo;
