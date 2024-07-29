import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledButton = styled.button`
  color: var(--gray-color3);
  text-decoration: underline;
  font-family: "PretendardM";
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 20px;
  justify-content: left;

  &:hover {
    color: gray;
  }
`;

const ModalOverlay = styled.div`
  font-family: "PretendardM";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 240px;
  height: 120px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
`;

// 확인
const ConfirmButton = styled.button`
  font-family: "PretendardS";
  background: var(--green-color);
  color: var(--black-color);
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #25812a;
  }
`;

// 취소
const CancelButton = styled.button`
  background: var(--pink-color2);
  color: var(--black-color);
  font-family: "PretendardS";
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: var(--pink-color3);
  }
`;

const LogoutButton = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <StyledButton onClick={openModal}>로그아웃</StyledButton>
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <p>정말 로그아웃 하시겠습니까?</p>
            <ButtonGroup>
              <ConfirmButton onClick={handleLogout}>확인</ConfirmButton>
              <CancelButton onClick={closeModal}>취소</CancelButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default LogoutButton;
