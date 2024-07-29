import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Image from "../Image/Image";
import tagsData from "../Tag/tagsData.json";
import Button from "../Button/Button";
import authApi from "../../apis/authApi";
import { useNavigate } from "react-router-dom";
import {
  getOwnerInfo,
  createChatRoom,
  enterChatRoom,
  getProfileImage,
} from "../../apis/chatApi";
import { getUserInfo } from "../../apis/getUserInfo";
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
  const [userInfo, setUserInfo] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null); // 견주 정보를 저장할 상태
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchDogInfo = async () => {
      try {
        console.log("Fetching dog info for dog ID:", dogId);
        const dogResponse = await authApi.get(`/dogs/${dogId}`);
        const tagsResponse = await authApi.get(`/dogs/${dogId}/tags`);
        setDog(dogResponse.data.dog);
        setTags(tagsResponse.data.tags);

        // 견주 정보 조회
        const ownerInfoResponse = await getOwnerInfo(dogId);
        const ownerProfileImage = await getProfileImage(
          ownerInfoResponse.owner_id,
        );
        setOwnerInfo({
          ...ownerInfoResponse,
          owner_image: ownerProfileImage.image,
        });

        // 본인 유저 아이디 조회
        const userInfoResponse = await getUserInfo();
        const userProfileImage = await getProfileImage(userInfoResponse.id);
        setUserInfo({
          ...userInfoResponse,
          profile_image: userProfileImage.image,
        });
      } catch (error) {
        console.error("Error fetching dog info:", error);
      }
    };

    fetchDogInfo();
  }, [dogId]);

  if (!dog || !userInfo || !ownerInfo) {
    return null;
  }

  // 태그 id 매칭
  const getTagInfo = (tagId) => tagsData.find((tag) => tag.id === tagId);

  // 유저와 보호자 간 채팅방 생성
  const handleContactButtonClick = async () => {
    try {
      const createdRoom = await createChatRoom(
        dogId,
        userInfo.id,
        ownerInfo.owner_id,
      );
      const roomId = createdRoom.id;

      if (roomId) {
        const roomInfo = await enterChatRoom(roomId);
        console.log("Room Info:", roomInfo);
        navigate(`/chat/rooms/${roomInfo.id}`, {
          state: {
            roomInfo,
            userInfo,
            ownerInfo,
          },
        });
      } else {
        console.error("Failed to create chat room");
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
