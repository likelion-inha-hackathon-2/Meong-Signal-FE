import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Image from "../Image/Image";
import tagsData from "../Tag/tagsData.json";
import Button from "../Button/Button";
import authApi from "../../apis/authApi"; // authApi import

const Tooltip = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  z-index: 100;
`;

const Tag = styled.span`
  margin: 0 5px;
  padding: 5px;
  background-color: #eee;
  border-radius: 4px;
`;

const CloseButton = styled.button`
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const DogMoreInfo = ({ dogId, onClose }) => {
  const [dog, setDog] = useState(null);
  const [tags, setTags] = useState([]);

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

  return (
    <Tooltip>
      <Image
        src={dog.image}
        alt={dog.name}
        style={{ width: "70px", height: "70px" }}
      />
      <h3>{dog.name}</h3>
      <p>성별: {dog.gender === "M" ? "남" : "여"}</p>
      <p>나이: {dog.age}살</p>
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
      <Button
        text="💌보호자와 채팅하기"
        onClick={() => (window.location.href = `/chat/${dogId}`)}
      />
      <CloseButton onClick={onClose}>닫기</CloseButton>
    </Tooltip>
  );
};

DogMoreInfo.propTypes = {
  dogId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DogMoreInfo;
