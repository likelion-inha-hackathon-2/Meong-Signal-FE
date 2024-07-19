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
  width: 140px;
  height: 140px;
  border-radius: 0px;
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

// 태그 임의로 네이밍
const tagsData = [
  { id: 1, label: "활발한", emoji: "😁" },
  { id: 2, label: "잘 달리는", emoji: "🐶" },
  { id: 3, label: "애교쟁이", emoji: "😘" },
  { id: 4, label: "장난쟁이", emoji: "😜" },
  { id: 5, label: "순딩이", emoji: "😇" },
  { id: 6, label: "소심해요", emoji: "😢" },
  { id: 7, label: "조용해요", emoji: "😌" },
  { id: 8, label: "시크쟁이", emoji: "🫤" },
  { id: 9, label: "친화력", emoji: "😊" },
];

const RegisterDog = () => {
  const { values, handleChange, reset } = useForm({
    name: "",
    gender: "M",
    age: "1",
    introduction: "",
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleRegisterDog = async () => {
    const dog = {
      name: values.name,
      gender: values.gender,
      age: values.age,
      introduction: values.introduction,
      image: image ? URL.createObjectURL(image) : null, // 이미지가 없으면 null로 설정
    };

    const tags = selectedTags.map((tag) => ({ number: tag.id }));
    const payload = { dog, tags };

    try {
      await authApi.post("/dogs/new", payload, {
        headers: { "Content-Type": "application/json" },
      });
      reset();
      setSelectedTags([]);
      setImage(null);
      alert("강아지가 등록되었습니다.");
      navigate("/myinfo-main"); // 등록 성공 후 MyInfoMain 페이지로 이동
    } catch (error) {
      console.error("Failed to register dog:", error); // 실패 시 콘솔에 오류 메시지 출력
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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
      <Header />
      <Container>
        <ImageUpload>
          <StyledImage
            src={image ? URL.createObjectURL(image) : AddDogImage}
            alt="Dog"
          />
          <FileInput
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <UploadButton htmlFor="imageUpload" style={{ marginBottom: "10px" }}>
            사진 업로드
          </UploadButton>
        </ImageUpload>

        <Input
          label="이름"
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="강아지 이름을 입력하세요"
          style={{ marginBottom: "10px" }}
        />
        <Row>
          <Input
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
        <Input
          label="소개"
          type="textarea"
          name="introduction"
          value={values.introduction}
          onChange={handleChange}
          placeholder="간단히 소개해주세요."
          style={{ marginBottom: "10px", resize: "none" }}
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
        <Button
          text="강아지 등록"
          onClick={handleRegisterDog}
          style={{ marginTop: "10px" }}
        />
      </Container>
      <Footer />
    </>
  );
};

export default RegisterDog;
