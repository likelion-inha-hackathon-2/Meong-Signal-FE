import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  getAllAchievements,
  // eslint-disable-next-line no-unused-vars
  setRepresentativeAchievement,
  getRepresentativeAchievement,
} from "../../apis/achievement";
import IconDogEmoji from "../../assets/icons/icon-dogEmoji.png";

const AchievementContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 350px;
  margin: 20px 0;
`;

const AchievementCategory = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
`;

const AchievementTitle = styled.h2`
  font-size: 20px;
  font-family: "PretendardB";
  margin-bottom: 10px;
`;

const AchievementList = styled.ul`
  list-style: none;
  padding: 0;
`;

const AchievementItem = styled(styled.li.withConfig({
  shouldForwardProp: (prop) => prop !== "isRepresentative",
})`
  background-color: var(--gray-color1);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  // 설정된 업적이라면 테두리 설정
  border: ${({ isRepresentative }) =>
    isRepresentative ? "3px solid var(--blue-color)" : "none"};
`)``;

const AchievementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressBar = styled.div`
  background-color: var(--gray-color2);
  border-radius: 4px;
  overflow: hidden;
  height: 25px;
  margin-top: 10px;
  position: relative;
`;

const Progress = styled.div`
  background-color: var(--green-color);
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  transition: width 0.3s;
  position: relative;
`;

const DogEmoji = styled.img`
  position: absolute;
  top: -2px;
  right: -10px;
  height: 25px;
  width: 25px;
  z-index: 99;
  transform: translateX(${({ $progress }) => $progress}%);
`;

const AchievementText = styled.span`
  margin: 5px 0;
  font-family: "PretendardM";
`;

const AchievementFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledButton = styled(Button)`
  font-size: 14px;
  background-color: var(--blue-color);
  color: white;
  border: none;
  cursor: pointer;
  width: 120px;
  height: 30px;
  &:hover {
    background-color: #0700c8;
  }
`;

const GoalsStatus = () => {
  const [goalsStatus, setGoalsStatus] = useState({ dog: [], walking: [] });
  const [message, setMessage] = useState("");
  const [representativeAchievement, setRepresentativeAchievement] =
    useState(null);

  useEffect(() => {
    const fetchGoalsStatus = async () => {
      try {
        const data = await getAllAchievements();
        setGoalsStatus(data);
      } catch (error) {
        console.error("Error fetching goalsStatus:", error);
      }
    };

    const fetchRepresentativeAchievement = async () => {
      try {
        const data = await getRepresentativeAchievement();
        setRepresentativeAchievement(data);
      } catch (error) {
        console.error("Error fetching representative achievement:", error);
      }
    };

    fetchGoalsStatus();
    fetchRepresentativeAchievement();
  }, []);

  const handleSetRepresentative = async (achievement) => {
    if (achievement.is_representative === 1) {
      alert("이미 등록된 업적입니다.");
      return;
    }
    if (achievement.is_achieved === 0) {
      alert("아직 달성하지 않은 업적입니다.");
      return;
    }
    try {
      const response = await setRepresentativeAchievement(achievement.id);
      setMessage(response.message);
      setRepresentativeAchievement({
        id: achievement.id,
        title: achievement.title,
      });
      alert(`${achievement.title}이 대표 업적으로 설정되었습니다.`);
    } catch (error) {
      console.error(error);
    }
  };

  const renderGoalsStatus = (achievementList, isWalking = false) =>
    achievementList.map((achievement) => {
      const progress = (achievement.now_count / achievement.total_count) * 100;
      const unit = isWalking ? "km" : "번";
      const totalText = `${achievement.total_count}${unit}`;
      const isRepresentative = representativeAchievement?.id === achievement.id;
      return (
        <AchievementItem
          key={achievement.id}
          isRepresentative={isRepresentative}
        >
          <AchievementHeader>
            <AchievementText>
              {achievement.title} ({totalText})
            </AchievementText>
            <StyledButton
              text="대표 업적 설정하기"
              onClick={() => handleSetRepresentative(achievement)}
            />
          </AchievementHeader>
          <ProgressBar>
            <Progress $progress={progress}>
              <DogEmoji src={IconDogEmoji} $progress={progress} />
            </Progress>
          </ProgressBar>
          <AchievementFooter>
            <AchievementText>
              {achievement.now_count} / {achievement.total_count}
            </AchievementText>
            {achievement.is_achieved ? (
              <AchievementText>Completed!!</AchievementText>
            ) : null}
          </AchievementFooter>
        </AchievementItem>
      );
    });

  return (
    <>
      <Header />
      <AchievementContainer>
        {message && <p>{message}</p>}
        {representativeAchievement ? (
          <AchievementCategory>
            <AchievementTitle>👑 대표 업적</AchievementTitle>
            <AchievementList>
              <AchievementItem>
                <AchievementText>
                  👟 {representativeAchievement.title}
                </AchievementText>
              </AchievementItem>
            </AchievementList>
          </AchievementCategory>
        ) : (
          <p>아직 달성한 업적이 없습니다.</p>
        )}
        <AchievementCategory>
          <AchievementTitle>🐶 강쥐와 친해지기</AchievementTitle>
          <AchievementList>
            {renderGoalsStatus(goalsStatus.dog)}
          </AchievementList>
        </AchievementCategory>
        <AchievementCategory>
          <AchievementTitle>🏃‍♂️ 강쥐와 튼튼해지기</AchievementTitle>
          <AchievementList>
            {renderGoalsStatus(goalsStatus.walking, true)}
          </AchievementList>
        </AchievementCategory>
      </AchievementContainer>
      <Footer />
    </>
  );
};

export default GoalsStatus;
