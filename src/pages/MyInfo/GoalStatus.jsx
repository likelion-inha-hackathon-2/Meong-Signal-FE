import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  getAllAchievements,
  setRepresentativeAchievement,
} from "../../apis/achievement";

const AchievementContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 300px;
`;

const AchievementCategory = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
`;

const AchievementTitle = styled.h2`
  font-size: 24px;
  font-family: "PretendardB";
  margin-bottom: 10px;
`;

const AchievementList = styled.ul`
  list-style: none;
  padding: 0;
`;

const AchievementItem = styled.li`
  background-color: var(--gray-color1);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

const AchievementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressBar = styled.div`
  background-color: var(--gray-color2);
  border-radius: 4px;
  overflow: hidden;
  height: 20px;
  margin-top: 10px;
`;

const Progress = styled.div`
  background-color: var(--green-color);
  height: 100%;
  width: ${({ progress }) => progress}%;
  transition: width 0.3s;
`;

const AchievementText = styled.span`
  margin: 5px 0;
  font-family: "PretendardR";
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
  &:hover {
    background-color: #0700c8;
  }
`;

const GoalsStatus = () => {
  const [goalsStatus, setGoalsStatus] = useState({ dog: [], walking: [] });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGoalsStatus = async () => {
      try {
        const data = await getAllAchievements();
        setGoalsStatus(data);
      } catch (error) {
        console.error("Error fetching goalsStatus:", error);
      }
    };

    fetchGoalsStatus();
  }, []);

  const handleSetRepresentative = async (achievement) => {
    if (achievement.is_representative === 1) {
      alert("이미 등록된 업적입니다.");
      return;
    }
    try {
      const response = await setRepresentativeAchievement(achievement.id);
      setMessage(response.message);
      alert(`${achievement.title}이 대표 업적으로 설정되었습니다.`);
    } catch (error) {
      console.error(error);
    }
  };

  const renderGoalsStatus = (achievementList) =>
    achievementList.map((achievement) => {
      const progress = (achievement.now_count / achievement.total_count) * 100;
      return (
        <AchievementItem key={achievement.id}>
          <AchievementHeader>
            <AchievementText>{achievement.title}</AchievementText>
            <StyledButton
              text="대표 업적 설정하기"
              onClick={() => handleSetRepresentative(achievement)}
            />
          </AchievementHeader>
          <ProgressBar>
            <Progress progress={progress} />
          </ProgressBar>
          <AchievementFooter>
            <AchievementText>
              {achievement.now_count} / {achievement.total_count}
            </AchievementText>
            {achievement.is_achieved && (
              <AchievementText>Completed!!</AchievementText>
            )}
          </AchievementFooter>
        </AchievementItem>
      );
    });

  return (
    <>
      <Header />
      <AchievementContainer>
        {message && <p>{message}</p>}
        <AchievementCategory>
          <AchievementTitle>강쥐와 친해지기 업적</AchievementTitle>
          <AchievementList>
            {renderGoalsStatus(goalsStatus.dog)}
          </AchievementList>
        </AchievementCategory>
        <AchievementCategory>
          <AchievementTitle>걸은 거리 업적</AchievementTitle>
          <AchievementList>
            {renderGoalsStatus(goalsStatus.walking)}
          </AchievementList>
        </AchievementCategory>
      </AchievementContainer>
      <Footer />
    </>
  );
};

export default GoalsStatus;
