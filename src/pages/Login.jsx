import React from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import authApi from "../apis/authApi";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

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

  const handleSignup = async () => {
    const signupData = {
      // 이 부분에 회원가입할 데이터 집어넣고 테스트!
      email: "",
      password: "",
      nickname: "",
      road_address: "인하로 100",
      detail_address: "상세주소",
    };

    console.log("Signup data being sent:", signupData);

    try {
      const response = await authApi.post("/users/signup", signupData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      if (response.data && response.data.status === "200") {
        alert("회원가입에 성공했습니다.");
      } else {
        alert(response.data.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response) {
        alert(`${error.response.status})`);
      } else if (error.request) {
        alert("서버와의 통신에 실패했습니다.");
      } else {
        alert("회원가입에 실패했습니다.");
      }
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "400px" }}>
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
        <Button text="로그인" type="submit" style={{ width: "100%" }} />
      </form>
      <Button
        text="회원가입"
        onClick={handleSignup}
        style={{ width: "100%", marginTop: "10px" }}
      />
      <Footer />
    </>
  );
};

export default Login;
