import React, { useState, useCallback } from "react";
import styled from "styled-components";
import useForm from "../../hooks/useForm";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import authApi from "../../apis/authApi";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import AddDogImage from "../../assets/images/add-dog.png";
import { useNavigate } from "react-router-dom";

// 모든 요소 묶는 전체 컨테이너
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 350px;
`;

const ImageUpload = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  width: 100%;
  margin-bottom: 10px;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 8px;
  margin: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  // 클릭할때마다 상태 변경
  background-color: ${(props) =>
    props.selected ? "var(--yellow-color2)" : "var(--white-color)"};
  font-family: "PretendardR";
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: -0.11px;
`;

const StyledImage = styled.img`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  object-fit: cover;
  padding: 20px;
`;

// 사진 업로드용 버튼
const UploadButton = styled.label`
  font-family: "PretendardM";
  font-size: 14px;
  background-color: var(--yellow-color2);
  color: var(--white-color);
  display: flex;
  width: 120px;
  height: 32px;
  padding: 4px 19px;
  text-align: center;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: var(--yellow-color3);
  }
`;

// 파일 업로드 부분은 숨기기
const FileInput = styled.input`
  display: none;
`;

const StyledInput = styled(Input)`
  margin-bottom: 10px;
  resize: none;
`;

const StyledButton = styled(Button)`
  margin-top: 10px;
`;

const tagsData = [
  { id: 1, label: "활발한", emoji: "😁" },
  { id: 2, label: "잘 달리는", emoji: "🐶" },
  { id: 3, label: "애교쟁이", emoji: "😘" },
  { id: 4, label: "장난쟁이", emoji: "😜" },
  { id: 5, label: "순딩이", emoji: "😇" },
  { id: 6, label: "소심해요", emoji: "😢" },
  { id: 7, label: "조용해요", emoji: "😌" },
  { id: 8, label: "시크쟁이", emoji: "😶" },
  { id: 9, label: "친화력", emoji: "😊" },
];

const RegisterDog = () => {
  const { values, handleChange, reset } = useForm({
    name: "",
    gender: "M",
    age: "1",
    introduction: "",
    image: "",
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [dogImage, setDogImage] = useState(null);
  const navigate = useNavigate();

  const handleRegisterDog = async () => {
    try {
      const formData = new FormData();
      if (values.name) {
        formData.append("dog[name]", values.name);
      }
      if (values.gender) {
        formData.append("dog[gender]", values.gender);
      }
      if (values.age) {
        formData.append("dog[age]", values.age);
      }
      if (values.introduction) {
        formData.append("dog[introduction]", values.introduction);
      }

      if (dogImage) {
        formData.append("image", dogImage);
      }

      selectedTags.forEach((tag, index) => {
        formData.append(`tags[${index}][number]`, tag.id);
      });

      const response = await authApi.post("/dogs/new", formData);

      if (response.status === 201) {
        alert("강아지가 등록되었습니다.");
        reset();
        setSelectedTags([]);
        setDogImage(null);
        navigate("/myinfo-main");
      } else {
        console.error("Failed to register dog:", response.data);
        alert("강아지 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to register dog:", error);
      alert("강아지 등록에 실패했습니다.");
    }
  };

  const handleTagClick = useCallback(
    (tag) => {
      if (selectedTags.includes(tag)) {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
      } else if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tag]);
      }
    },
    [selectedTags],
  );

  const handleDogImageChange = (e) => {
    const file = e.target.files[0];
    setDogImage(file);
    handleChange({ target: { name: "image", value: file } });
  };

  return (
    <>
      <Header />
      <Container>
        <ImageUpload>
          <StyledImage
            src={dogImage ? URL.createObjectURL(dogImage) : AddDogImage}
            alt="Dog"
          />
          <FileInput
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleDogImageChange}
          />
          <UploadButton htmlFor="imageUpload">사진 업로드</UploadButton>
        </ImageUpload>

        <StyledInput
          label="이름"
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="강아지 이름을 입력하세요"
        />
        <Row>
          <StyledInput
            label="나이"
            type="number"
            name="age"
            value={values.age}
            onChange={handleChange}
            placeholder="1"
            min="1"
            max="20"
            style={{ width: "50%" }}
          />
          <Input
            label="성별"
            as="select"
            name="gender"
            value={values.gender}
            onChange={handleChange}
            style={{
              padding: "8px",
            }}
          >
            <option value="M">남자</option>
            <option value="F">여자</option>
          </Input>
        </Row>
        <StyledInput
          label="소개"
          type="textarea"
          name="introduction"
          value={values.introduction}
          onChange={handleChange}
          placeholder="간단히 소개해주세요."
        />
        <div>
          {tagsData.map((tag) => (
            <Tag
              key={tag.id}
              selected={selectedTags.includes(tag)}
              onClick={() => handleTagClick(tag)}
            >
              #{tag.label} {tag.emoji}
            </Tag>
          ))}
        </div>
        <StyledButton text="강아지 등록하기" onClick={handleRegisterDog} />
      </Container>
      <Footer />
    </>
  );
};

export default RegisterDog;
