import React, { useState } from "react";
import styled from "styled-components";
import Input from "../../components/Input/Input";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import authApi from "../../apis/authApi";
import useForm from "../../hooks/useForm";
import AddDogImage from "../../assets/images/add-dog.png";
import { useNavigate } from "react-router-dom";

const MyInfoEditContainer = styled.div`
  padding: 20px;
  width: 350px;
`;

const SectionTitle = styled.h3`
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 20px;
  font-family: "PretendardB";
  text-align: left;
`;

const StyledImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 0px;
`;

const ImageUpload = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

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

const FileInput = styled.input`
  display: none;
`;

const AddressButton = styled(Button)`
  margin-top: 10px;
  background-color: var(--yellow-color1);
  color: var(--black-color);
  margin-bottom: 10px;
`;

const SaveButton = styled(Button)`
  width: 100%;
  background-color: var(--yellow-color2);
  color: var(--black-color);
`;

const MyInfoEdit = () => {
  const { values, handleChange, reset } = useForm({
    nickname: "",
    road_address: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  const handlePostcodeComplete = (data) => {
    handleChange({ target: { name: "road_address", value: data.roadAddress } });
  };

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: handlePostcodeComplete,
    }).open();
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("nickname", values.nickname);
      formData.append("road_address", values.road_address);
      formData.append("profile_image", profileImage);

      await authApi.put("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("정보가 성공적으로 변경되었습니다.");
      reset();
      setProfileImage(null);
      navigate("/myinfo-main"); // 변경 성공 후 MyInfoMain 페이지로 이동
    } catch (error) {
      console.error("Failed to update user info:", error);
      alert("정보 변경에 실패했습니다.");
    }
  };

  return (
    <>
      <Header />
      <MyInfoEditContainer>
        <SectionTitle>내 정보 수정</SectionTitle>
        <ImageUpload>
          <StyledImage
            src={profileImage ? URL.createObjectURL(profileImage) : AddDogImage}
            alt="Profile"
          />
          <FileInput
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
          <UploadButton htmlFor="imageUpload" style={{ marginBottom: "10px" }}>
            사진 업로드
          </UploadButton>
        </ImageUpload>

        <Input
          label="닉네임"
          id="nickname"
          type="text"
          name="nickname"
          placeholder="변경할 닉네임을 입력하세요."
          value={values.nickname}
          onChange={handleChange}
          style={{ marginBottom: "10px" }}
        />

        <Input
          label="도로명 주소"
          id="roadAddress"
          type="text"
          name="road_address"
          value={values.road_address}
          readOnly
          placeholder="도로명 주소를 검색하세요."
        />
        <AddressButton text="도로명 주소 찾기" onClick={openPostcode} />
        <SaveButton text="변경 저장하기" onClick={handleSave} />
      </MyInfoEditContainer>
      <Footer />
    </>
  );
};

export default MyInfoEdit;
