import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  getAllAchievements,
  // eslint-disable-next-line no-unused-vars
  setRepresentativeAchievement,
  getRepresentativeAchievement,
} from "../../apis/achievement";
import Achievement from "../../components/Achievement/Achievement";

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

const GoalStatus = () => {
  const [goalsStatus, setGoalsStatus] = useState({ dog: [], walking: [] });
  const [representativeAchievement, setRepresentativeAchievement] =
    useState(null);
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState(""); // 업적 등록 시 메시지

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

  useEffect(() => {
    fetchGoalsStatus();
    fetchRepresentativeAchievement();
  }, []);

  // 대표 업적 예외 처리
  const handleSetRepresentative = async (achievement) => {
    if (achievement.is_representative === 1) {
      alert("이미 대표로 등록된 업적입니다.");
      return;
    }
    if (achievement.is_achieved === 0) {
      alert("아직 완료되지 않은 업적입니다.");
      return;
    }
    try {
      console.log("업적 ID 포스트하는거:", achievement.id);
      const response = await setRepresentativeAchievement(achievement.id);
      const message = response.message;
      console.log("API response message:", message);
      setMessage(message);

      if (message === "대표로 등록되었습니다.") {
        await fetchGoalsStatus(); // 모든 업적 목록 재조회
        await fetchRepresentativeAchievement(); // 대표 업적 재조회
        alert(`${achievement.title}이 대표 업적으로 설정되었습니다.`);
      } else {
        alert(message);
      }
    } catch (error) {
      console.error("Error setting representative achievement:", error);
      alert("대표 업적 설정 중 오류가 발생했습니다.");
    }
  };
  const isRepresentative = (achievement) => {
    if (!representativeAchievement) {
      return false;
    }
    return representativeAchievement.id === achievement.id;
  };

  return (
    <>
      <Header />
      <Container>
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
        <Achievement
          title="🐶 강쥐와 친해지기"
          achievements={goalsStatus.dog}
          handleSetRepresentative={handleSetRepresentative}
          isRepresentative={isRepresentative}
        />
        <Achievement
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

export default GoalStatus;
