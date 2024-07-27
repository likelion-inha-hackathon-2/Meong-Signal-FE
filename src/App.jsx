import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TopUp from "./pages/TopUp";
import SignUp1 from "./pages/SignUp/SignUp1";
import SignUp2 from "./pages/SignUp/SignUp2";
import MapInfo from "./pages/Map/MapInfo";
import MapStatus from "./pages/Map/MapStatus";
import TagFiltering from "./pages/Map/TagFiltering";
import ReviewReceived from "./pages/MyInfo/ReviewReceived";
import ReviewWritten from "./pages/MyInfo/ReviewWritten";
import MyInfoMain from "./pages/MyInfo/MyInfoMain";
import MyInfoEdit from "./pages/MyInfo/MyInfoEdit";
import RegisterDog from "./pages/MyInfo/RegisterDog";
import GoalStatus from "./pages/MyInfo/GoalStatus";
import WalkDetail from "./pages/Walk/WalkDetail";
import ChatList from "./pages/Chat/ChatList";
import ChatRoom from "./pages/Chat/ChatRoom";
import KakaoAuth from "./pages/SocialLogin/KakaoAuth";
import NaverAuth from "./pages/SocialLogin/NaverAuth";
import GoogleAuth from "./pages/SocialLogin/GoogleAuth";
import MyWalk from "./pages/MyInfo/MyWalk";
import RecordMyDogWalk from "./pages/MyInfo/RecordMyDogWalk";
import MapStatusUser from "./pages/Map/MapStatusUser";
import MapWalkingTest from "./pages/Map/MapWalkingTest"; // 웹소켓 테스트 페이지
import OwnerReview from "./pages/MyInfo/OwnerReview";
import UserReview from "./pages/MyInfo/UserReview";
import MoreRecordMyDogWalk from "./pages/MyInfo/MoreRecordMyDogWalk";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="home" element={<Home />} />
          <Route path="topup" element={<TopUp />} />
          <Route path="signup1" element={<SignUp1 />} />
          <Route path="signup2" element={<SignUp2 />} />
          <Route path="map-info" element={<MapInfo />} />
          <Route path="map-status" element={<MapStatus />} />
          <Route path="map-status/:dogId" element={<MapStatusUser />} />
          <Route path="map-tag" element={<TagFiltering />} />
          <Route path="chatlist" element={<ChatList />} />
          <Route path="chat/rooms/:roomId" element={<ChatRoom />} />
          <Route path="reviews/received" element={<ReviewReceived />} />
          <Route path="reviews/written" element={<ReviewWritten />} />
          <Route path="/review/owner" element={<OwnerReview />} />
          <Route path="/review/user" element={<UserReview />} />
          <Route path="myinfo-main" element={<MyInfoMain />} />
          <Route path="myinfo-edit" element={<MyInfoEdit />} />
          <Route path="achievement" element={<GoalStatus />} />
          <Route path="dogs-new" element={<RegisterDog />} />
          <Route path="walk" element={<WalkDetail />} />
          <Route path="walk-my-record" element={<MyWalk />} />
          <Route path="/record-my-dog-walk" element={<RecordMyDogWalk />} />
          <Route
            path="/more-record-my-dog-walk"
            element={<MoreRecordMyDogWalk />}
          />
          <Route path="chat" element={<ChatList />} />
          <Route path="kakao/auth" element={<KakaoAuth />} />
          <Route path="naver/auth" element={<NaverAuth />} />
          <Route path="google/auth" element={<GoogleAuth />} />
          <Route path="map-walking-test" element={<MapWalkingTest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
