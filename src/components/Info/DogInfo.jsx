import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import authApi from "../../apis/authApi";
import Image from "../Image/Image";
import { Tooltip as ReactTooltip } from "react-tooltip";

// 이미지 임포트
import statusR from "../../assets/images/status-r.png";
import statusB from "../../assets/images/status-b.png";
import statusW from "../../assets/images/status-w.png";
import statusChange from "../../assets/images/status-change.png";

const DogInfoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 310px;
  height: 107px;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: var(--yellow-color1);
`;

const DogImage = styled(Image)`
  width: 80px;
  height: auto;
`;

const DogInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  font-family: "PretendardM";
  font-size: 12px;
  font-style: normal;
  line-height: 150%;
  letter-spacing: -0.132px;
`;

const DogStatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatusButton = styled.button`
  margin-top: 10px;
  padding: 5px;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
`;

const StatusTooltip = styled(ReactTooltip)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 180px;
  gap: 10px;
`;

const statusImages = {
  R: statusR,
  B: statusB,
  W: statusW,
  change: statusChange,
};

const DogInfo = ({ id, name, gender, age, introduction, status, image }) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      console.log(`Changing status to ${newStatus} for dog ID: ${id}`);
      const response = await authApi.patch(`/dogs/status/${id}`, {
        status: newStatus,
      });
      console.log("Status change response:", response);
      setCurrentStatus(newStatus);
      setTooltipVisible(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <DogInfoContainer>
      <DogImage src={image} alt={`${name}`} />
      <DogInfoWrapper>
        <div>이름: {name}</div>
        <div>나이: {age}</div>
        <div>성별: {gender === "M" ? "남" : "여"}</div>
        <div>소개: {introduction}</div>
      </DogInfoWrapper>
      <DogStatusWrapper>
        <StatusButton
          data-tooltip-id={`tooltip-${id}`}
          data-tooltip-place="top"
          onClick={() => setTooltipVisible(!tooltipVisible)}
        >
          <img src={statusImages[currentStatus]} alt="상태 변경" />
        </StatusButton>
        <StatusTooltip
          id={`tooltip-${id}`}
          clickable={true}
          isOpen={tooltipVisible}
        >
          <div onClick={() => handleStatusChange("R")}>
            <img src={statusImages.R} alt="쉬는 중" width="50" height="50" />
          </div>
          <div onClick={() => handleStatusChange("B")}>
            <img src={statusImages.B} alt="심심함" width="50" height="50" />
          </div>
          <div onClick={() => handleStatusChange("W")}>
            <img src={statusImages.W} alt="산책 중" width="50" height="50" />
          </div>
        </StatusTooltip>
      </DogStatusWrapper>
    </DogInfoContainer>
  );
};

DogInfo.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  introduction: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default DogInfo;
