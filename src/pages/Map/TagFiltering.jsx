import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Tag from "../../components/Tag/Tag";
import authApi from "../../apis/authApi";
import { getCoordinates } from "../../apis/geolocation";

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

const TitleWrapper = styled.h1`
  font-size: 20px;
  font-family: "PretendardB";
  font-weight: 700;
`;

const TestWrapper = styled.div`
  font-size: 16px;
  font-family: "PretendardM";

  margin: 20px;
  color: var(--gray-color3);
`;

const TagFiltering = () => {
  const [selectedTags, setSelectedTags] = useState([]); // 선택한 태그
  const [dogs, setDogs] = useState([]); // 해당하는 태그에 대한 강아지만
  const [allDogs, setAllDogs] = useState([]); // 모든 강아지 데이터 저장
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const coordinates = await getCoordinates();
        console.log("Current coordinates:", coordinates);
        setLocation(coordinates);
      } catch (error) {
        console.error("Failed to get current position:", error);
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchDogs = async () => {
      if (location) {
        try {
          const response = await authApi.post("/dogs/all-status", {
            latitude: location.latitude,
            longitude: location.longitude,
          });

          if (response.status === 200) {
            console.log("Fetched dogs:", response.data.dogs);
            setDogs(response.data.dogs);
            setAllDogs(response.data.dogs); // 모든 강아지 데이터를 저장
          } else {
            console.error("Failed to fetch dogs:", response.data);
          }
        } catch (error) {
          console.error("Failed to fetch dogs:", error);
        }
      }
    };

    fetchDogs();
  }, [location]);

  useEffect(() => {
    if (selectedTags.length > 0) {
      const filteredDogs = allDogs.filter((dog) =>
        selectedTags.some((tag) => dog.status === tag.id),
      );
      setDogs(filteredDogs);
    } else {
      setDogs(allDogs); // 선택된 태그가 없으면 모든 강아지를 보여줌
    }
  }, [selectedTags, allDogs]);

  const handleTagClick = (tag) => {
    let newSelectedTags;
    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter((t) => t !== tag);
    } else if (selectedTags.length < 3) {
      newSelectedTags = [...selectedTags, tag];
    } else {
      return;
    }

    setSelectedTags(newSelectedTags);
  };

  return (
    <>
      <Header />
      <TitleWrapper>함께 산책하고 싶은 강아지를 만나보세요!</TitleWrapper>
      <TestWrapper>최대 3개의 태그까지 선택하여 검색할 수 있어요.</TestWrapper>
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
