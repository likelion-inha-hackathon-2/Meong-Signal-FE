import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Image from "../Image/Image";
import tagsData from "../Tag/tagsData.json";
import Button from "../Button/Button";
import authApi from "../../apis/authApi";
import { useNavigate } from "react-router-dom";
import { createChatRoom, enterChatRoom } from "../../apis/chatApi";
import defaultDogImage from "../../assets/images/add-dog.png";

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
        console.log("Fetching dog info for dog ID:", dogId);
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

  // 유저와 보호자 간 채팅방 생성
  const handleContactButtonClick = async () => {
    try {
      // console.log("Creating chat room for dog ID:", dogId);
      const response = await createChatRoom(dogId);
      // 결과로 나온 룸 id로 접속
      if (response && response.id) {
        await enterChatRoom(response.id);
        navigate(`/chat/rooms/${response.id}`, {
          state: { dogId: dog.id },
        });
      }
    } catch (error) {
      console.error(
        "Error creating chat room:",
        error.response ? error.response.data : error,
      );
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
              {tagInfo ? `${tagInfo.emoji}${tagInfo.label}` : `#${tag.number}`}
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
