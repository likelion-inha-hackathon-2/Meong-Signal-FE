import React from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import authApi from "../apis/authApi";
import LogoImage from "../assets/images/logo.png";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Image from "../components/Image/Image";
import KaKaoIcon from "../assets/icons/social-login/icon-kakao.png";
import NaverIcon from "../assets/icons/social-login/icon-naver.png";
import GoogleIcon from "../assets/icons/social-login/icon-google.png";

const TitleSection = styled.h1`
  text-align: center;
  font-family: "PretendardB";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
`;

const StyledLink = styled(Link)`
  font-family: "pretendardS";
  font-size: 16px;
  padding: 4px;
  text-decoration: none;
  margin-top: 10px;
  color: var(--black-color);
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
`;

const IconImage = styled(Image)`
  width: 30px;
  height: 30px;
`;

const SocialLoginIconContainer = styled.div`
  display: inline-flex;
  padding: var(--sds-size-space-0);
  justify-content: center;
  align-items: flex-end;
  gap: 25px;
  width: 138px;
  height: 30px;
  margin-top: 30px;
`;

const Login = () => {
  const { values, handleChange } = useForm({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login data being sent:", {
      email: values.email,
      password: values.password,
    });

    try {
      const response = await authApi.post("/users/login", {
        email: values.email,
        password: values.password,
      });
      if (response.data && response.data.status === "200") {
        const { access_token, refresh_token } = response.data;
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        authApi.defaults.headers.common["Authorization"] =
          `Bearer ${access_token}`;
        navigate("/home");
      } else {
        alert(response.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        alert(error.response.data.message || "로그인에 실패했습니다.");
      } else if (error.request) {
        alert("서버와의 통신에 실패했습니다.");
      } else {
        alert("로그인에 실패했습니다.");
      }
    }
  };

  const handleSignupNavigate = () => {
    navigate("/signup1");
  };

  return (
    <>
      <TitleSection>멍멍! 같이 산책해요!</TitleSection>
      <img src={LogoImage} alt="로고 이미지" />
      <form onSubmit={handleLogin}>
        <Input
          label="이메일"
          type="text"
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="이메일을 입력하세요"
          style={{ marginBottom: "10px" }}
        />
        <Input
          label="비밀번호"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="비밀번호를 입력하세요"
          style={{ marginBottom: "10px" }}
        />
        <Button text="로그인" type="submit" />
      </form>
      <StyledLink to="/signup1" onClick={handleSignupNavigate}>
        회원가입
      </StyledLink>
      <SocialLoginIconContainer>
        <IconImage src={KaKaoIcon} />
        <IconImage src={NaverIcon} />
        <IconImage src={GoogleIcon} />
      </SocialLoginIconContainer>
    </>
  );
};

export default Login;
