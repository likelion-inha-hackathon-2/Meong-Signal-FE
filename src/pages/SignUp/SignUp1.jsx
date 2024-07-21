import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import useForm from "../../assets/hooks/useForm";
import cameraIcon from "../../assets/icons/icon-camera.png";
import userIcon from "../../assets/icons/icon-user-image.png";

const ProfileImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #ccc;
`;

const CameraIcon = styled.img`
  width: 24px;
  height: 24px;
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: pointer;
`;

const SignupForm = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 40px 20px;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const StyledInput = styled(Input)`
  width: 100%;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 40px;
  background-color: var(--yellow-color2);
  &:hover {
    background-color: var(--yellow-color2);
  }
`;

// 파일 업로드 부분은 숨기기
const FileInput = styled.input`
  display: none;
`;

const Signup1 = () => {
  const navigate = useNavigate();
  const { values, handleChange } = useForm({
    email: "",
    password: "",
    nickname: "",
    profile_image: null,
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      handleChange({ target: { name: "profile_image", value: file } });
    }
  };

  const handleNext = () => {
    navigate("/signup2", { state: { ...values, profileImage } });
  };

  return (
    <>
      <SignupForm>
        <ProfileImageWrapper>
          <ProfileImage src={profileImage || userIcon} alt="프로필 이미지" />
          <label htmlFor="profile-image-upload">
            <CameraIcon src={cameraIcon} alt="카메라 아이콘" />
          </label>
          <FileInput
            id="profile-image-upload"
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
        </ProfileImageWrapper>
        <StyledInput
          label="이메일"
          name="email"
          placeholder="이메일을 입력하세요"
          value={values.email}
          onChange={handleChange}
        />
        <StyledInput
          type="password"
          label="비밀번호"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={values.password}
          onChange={handleChange}
        />
        <StyledInput
          label="닉네임"
          name="nickname"
          placeholder="닉네임을 입력하세요"
          value={values.nickname}
          onChange={handleChange}
        />
        <StyledButton text="다음 페이지로" onClick={handleNext} />
      </SignupForm>
    </>
  );
};

export default Signup1;
