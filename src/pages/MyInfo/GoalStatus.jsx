import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  getAllAchievements,
  setRepresentativeAchievement,
  getRepresentativeAchievement,
} from "../../apis/achievement";
import AchievementCategory from "../../components/AchievementCategory/AchievementCategory";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 350px;
  margin: 20px 0;
`;

const RepresentativeAchievementContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
`;

const RepresentativeAchievementTitle = styled.h2`
  font-size: 20px;
  font-family: "PretendardB";
  margin-bottom: 10px;
`;

const RepresentativeAchievementItem = styled.div`
  background-color: var(--gray-color1);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

const RepresentativeAchievementText = styled.span`
  font-family: "PretendardM";
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

  const isRepresentative = (achievement) =>
    representativeAchievement?.id === achievement.id;

  return (
    <>
      <Header />
      <Container>
        {message && <p>{message}</p>}
        {representativeAchievement ? (
          <RepresentativeAchievementContainer>
            <RepresentativeAchievementTitle>
              👑 대표 업적
            </RepresentativeAchievementTitle>
            <RepresentativeAchievementItem>
              <RepresentativeAchievementText>
                👟 {representativeAchievement.title}
              </RepresentativeAchievementText>
            </RepresentativeAchievementItem>
          </RepresentativeAchievementContainer>
        ) : (
          <p>아직 달성한 업적이 없습니다.</p>
        )}
        <AchievementCategory
          title="🐶 강쥐와 친해지기"
          achievements={goalsStatus.dog}
          handleSetRepresentative={handleSetRepresentative}
          isRepresentative={isRepresentative}
        />
        <AchievementCategory
          title="🏃‍♂️ 강쥐와 튼튼해지기"
          achievements={goalsStatus.walking}
          handleSetRepresentative={handleSetRepresentative}
          isRepresentative={isRepresentative}
        />
      </Container>
      <Footer />
    </>
  );
};

export default GoalsStatus;
