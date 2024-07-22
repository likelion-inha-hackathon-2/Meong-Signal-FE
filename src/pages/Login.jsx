import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button/Button";
import Logo from "../assets/images/orangelogo.png";

const InputField = styled.input`
  width: 173px;
  height: 40px;
  padding: 6px 7px 6px 10px;
  border-radius: 8px;
  border: none;
  background-color: #ffe8ad;
  font-family: Pretendard;
  font-size: 14px;
`;

const Welcome = styled.span`
  font-family: "pretendardB";
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  text-align: center;
  color: #8b8b8b;
  display: block;
  margin-bottom: 20px;
`;

const InformationText = styled.span`
  font-family: "pretendardB";
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  text-align: center;
  white-space: nowrap;
  margin-right: 40px;
  width: 100px; /* 추가: 고정 너비로 통일 */
`;

const SignUp = styled.span`
  font-family: Pretendard;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  display: block;
  margin-top: 30px;
  cursor: pointer;
  text-decoration: underline;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 300px; /* 추가: 고정 너비로 통일 */
`;

const Login = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signup"); // 회원가입 페이지 경로로 이동
  };

  return (
    <Container>
      <Welcome>멍멍! 같이 산책해요!</Welcome>
      <img
        src={Logo}
        alt="Logo"
        width="299px"
        height="273px"
        style={{ marginBottom: "20px" }}
      />
      <InputGroup>
        <InformationText>이메일</InformationText>
        <InputField placeholder="이메일을 입력하세요." />
      </InputGroup>
      <InputGroup>
        <InformationText>비밀번호</InformationText>
        <InputField type="password" placeholder="비밀번호를 입력하세요." />
      </InputGroup>
      <Button text="로그인" />
      <SignUp onClick={handleSignUpClick}>회원가입</SignUp>
    </Container>
  );
};

export default Login;
