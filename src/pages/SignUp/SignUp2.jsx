import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import useForm from "../../assets/hooks/useForm";
import authApi from "../../assets/apis/authApi";
import mainImage from "../../assets/icons/icon-main-image.png";


const SignupForm = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledInput = styled(Input)`
  width: 100%;
  margin-bottom: 20px;
`;

const RoadButton = styled(Button)`
  width: 100px;
  height: 33px;
  border-radius: 15px;
  background-color: var(--yellow-color2);
  &:hover {
    background-color: var(--yellow-color2);
  }
  margin-bottom: 13px;
  margin-right: 78px;
`;



const StyledButton = styled(Button)`
  width: 100%;
  height: 40px;
  background-color: var(--yellow-color2);
  &:hover {
    background-color: var(--yellow-color2);
  }
`;

const MainImage = styled.img`
  width: 250px;
  height: auto;
  margin-bottom: 20px;
`;



const Signup2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const { values, handleChange, setValue } = useForm({
    ...state,
    road_address: "",
    detail_address: "",
  });

  const [error, setError] = useState("");

  const handleAddressChange = (data) => {
    setValue("road_address", data.roadAddress);
  };

  const openAddressPopup = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        handleAddressChange(data);
      }
    }).open();
  };

  const handleSignup = async () => {
    const signupData = {
      email: values.email,
      password: values.password,
      nickname: values.nickname,
      road_address: values.road_address,
      detail_address: values.detail_address,
    };
    console.log("Signup data being sent:", signupData);

    try {
      const response = await authApi.post("/users/signup", signupData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response.data);

      if (response.status === 201) {
        alert("회원가입에 성공했습니다.");
        localStorage.setItem("token", response.data.token); // 인증 토큰 저장
        navigate("/login");
      } else {
        setError(response.data.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response) {
        // 에러가 뜨면 콘솔창에 에러 출력
        console.log("Server response error:", error.response.data);
        if (error.response.data.message.email) {
          setError(`Error: ${error.response.data.message.email[0]}`);
        } else {
          setError(`${error.response.status} - ${error.response.data.message}`);
        }
      } else if (error.request) {
        setError("서버와의 통신에 실패했습니다.");
      } else {
        setError("회원가입에 실패했습니다.");
      }
    }
  };

  return (
    <>
      <SignupForm>
        <MainImage src={mainImage} alt="메인 이미지" />

        <RoadButton
          text="도로명 찾기"
          onClick={openAddressPopup}
        />
        
        <StyledInput
          label="집 주소"
          name="road_address"
          placeholder="도로명 주소를 입력하세요"
          value={values.road_address}
          onChange={handleChange}
        />
        
        <StyledInput
          label="상세주소"
          name="detail_address"
          placeholder="상세주소를 입력하세요"
          value={values.detail_address}
          onChange={handleChange}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <StyledButton
          text="회원가입 완료하기"
          onClick={handleSignup}
        />
      </SignupForm>
    </>
  );
};

export default Signup2;
