import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Tag from "../../components/Tag/Tag";
import authApi from "../../apis/authApi";
import { getCurrentPosition } from "../../apis/geolocation";
// import { useNavigate } from "react-router-dom";

// 강아지 여러마리 컨테이너
const DogList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

// 강아지 하나 컨테이너
const DogItem = styled.div`
  border: 1px solid var(--gray-color1);
  background-color: var(--yellow-color1);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const DogImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
`;

const DogName = styled.div`
  font-size: 18px;
  font-family: "PretendardS";
  font-weight: 700;
  margin-bottom: 5px;
`;

const DogAddress = styled.div`
  font-size: 14px;
  font-family: "PretendardR";
`;

const TagFiltering = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [location, setLocation] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const position = await getCurrentPosition();
        setLocation(position);
      } catch (error) {
        console.error("Failed to get current position:", error);
      }
    };
    fetchLocation();
  }, []);

  const handleTagClick = useCallback(
    async (tag) => {
      let newSelectedTags;
      if (selectedTags.includes(tag)) {
        newSelectedTags = selectedTags.filter((t) => t !== tag);
      } else if (selectedTags.length < 3) {
        newSelectedTags = [...selectedTags, tag];
      } else {
        return; // 태그 최대 3개까지만 선택 가능하도록
      }

      setSelectedTags(newSelectedTags);

      if (newSelectedTags.length > 0 && location) {
        try {
          const tagNumber = newSelectedTags[0].id; // 선택된 태그의 ID 사용하도록 수정하기
          const response = await authApi.post(
            `/dogs/search-by-tag/${tagNumber}`,
            {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          );

          if (response.status === 200) {
            setDogs(response.data.dogs);
          } else {
            console.error("Failed to fetch dogs:", response.data);
          }
        } catch (error) {
          console.error("Failed to fetch dogs:", error);
        }
      } else {
        setDogs([]);
      }
    },
    [selectedTags, location],
  );

  return (
    <>
      <Header />
      <h1>태그 필터링 페이지 수정중..</h1>
      <Tag selectedTags={selectedTags} handleTagClick={handleTagClick} />
      <DogList>
        {dogs.map((dog) => (
          <DogItem key={dog.id}>
            <DogImage src={dog.image} alt={dog.name} />
            <DogName>{dog.name}</DogName>
            <DogAddress>
              <p>{dog.distance}km 만큼 떨어진</p>
              <p>{dog.road_address}에 있어요.</p>
            </DogAddress>
          </DogItem>
        ))}
      </DogList>
      <Footer />
    </>
  );
};

export default TagFiltering;
