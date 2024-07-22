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
import WalkDetail from "./pages/Walk/WalkDetail";
import ChatList from "./pages/Chat/ChatList";
import Auth from "./pages/Auth";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/topup" element={<TopUp />} />
            <Route path="/signup1" element={<SignUp1 />} />
            <Route path="/signup2" element={<SignUp2 />} />
            <Route path="/map-info" element={<MapInfo />} />
            <Route path="/map-status" element={<MapStatus />} />
            <Route path="/map-tag" element={<TagFiltering />} />
            <Route path="/reviews/received" element={<ReviewReceived />} />
            <Route path="/reviews/written" element={<ReviewWritten />} />
            <Route path="/myinfo-main" element={<MyInfoMain />} />
            <Route path="/myinfo-edit" element={<MyInfoEdit />} />
            <Route path="/dogs-new" element={<RegisterDog />} />
            <Route path="/walk" element={<WalkDetail />} />
            <Route path="/chat" element={<ChatList />} />
            <Route path="/auth" element={<Auth />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
