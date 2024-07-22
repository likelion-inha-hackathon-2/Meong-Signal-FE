import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import authApi from "../apis/authApi";

const Auth = () => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");

  useEffect(() => {
    const formData = new FormData();
    formData.append("code", code);

    fetch(process.env.REACT_APP_BACKEND_URL + "/users/login/kakao/callback", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log(response);

        if (response.is_user == 0) {
          navigate("/signup2", {
            state: {
              social_id: response.social_id,
              email: response.email,
              nickname: response.nickname,
              profile_image: response.profile_image,
              road_address: "", // 초기값
              detail_address: "", // 초기값
            },
          });
        } else {
          const access_token = response.access_token;
          const refresh_token = response.refresh_token;
          localStorage.setItem("accessToken", access_token);
          localStorage.setItem("refreshToken", refresh_token);
          authApi.defaults.headers.common["Authorization"] =
            `Bearer ${access_token}`;
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [code, navigate]);

  return;
};

export default Auth;
