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

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/topup" element={<TopUp />} />
            <Route path="/signup1" element={<SignUp1 />} />
            <Route path="/signup2" element={<SignUp2 />} />
            <Route path="/map-info" element={<MapInfo />} />
            <Route path="/map-status" element={<MapStatus />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
