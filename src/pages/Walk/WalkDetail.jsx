import React, { useEffect, useState } from "react";
import styled from "styled-components";
import RecommendedTrail from "../../components/Trail/RecommendedTrail";
import SavedTrail from "../../components/Trail/SavedTrail";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  getRecommendedTrails,
  toggleTrail,
  getMarkedTrails,
  deleteTrail,
} from "../../apis/trail";
import { getCoordinates } from "../../apis/geolocation";
import { getChallenge } from "../../apis/getChallenge";
import footprintIcon from "../../assets/icons/icon-footprint.png";
import walkingIcon from "../../assets/icons/icon-walking2.png";

const WalkDetailContainer = styled.div`
  width: 340px;
  display: flex;
  flex-direction: column;
  padding: 10px 10px;
  margin: 20px 0;
`;

const TitleWrapper = styled.div`
  font-size: 20px;
  font-family: "PretendardB";
  margin-bottom: 10px;
`;

const ChallengeSection = styled.div`
  margin-bottom: 20px;
`;

const ChallengeItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${(props) =>
    props.$met === "true" ? "var(--yellow-color1)" : "var(--gray-color2)"};
  border: 2px solid
    ${(props) =>
      props.$met === "true" ? "var(--green-color)" : "var(--gray-color3)"};
  border-radius: 8px;
`;

const ChallengeText = styled.div`
  display: flex;
  align-items: center;
  font-family: "PretendardM";
  font-size: 15px;
`;

const ChallengeIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const ChallengeBadge = styled.div`
  display: flex;
  width: 75px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$met === "true" ? "var(--yellow-color2)" : "var(--gray-color3)"};
  color: #fff;
  font-family: "PretendardS";
  padding: 6px;
  border-radius: 6px;
`;

const FootprintIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 5px;
`;

const IsEmptyMessage = styled.p`
  margin-top: 10px;
  font-family: "PretendardM";
  font-size: 14px;
  color: gray;
`;

const ChallengeStatus = styled.p`
  font-family: "PretendardM";
  font-size: 14px;
  color: gray;
  margin-bottom: 10px;
`;

const WalkDetail = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [recommendedTrails, setRecommendedTrails] = useState([]);
  const [savedTrails, setSavedTrails] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [weekChallenge, setWeekChallenge] = useState({
    week_distance: 0,
    week_dogs: 0,
  });
  const [isDistanceChallengeMet, setIsDistanceChallengeMet] = useState(false);
  const [isDogsChallengeMet, setIsDogsChallengeMet] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const coordinates = await getCoordinates();
        setCurrentLocation(coordinates);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, []);

  useEffect(() => {
    const fetchRecommendedTrails = async () => {
      try {
        const data = await getRecommendedTrails(currentLocation);
        setRecommendedTrails(data.recommend_trails || []);
      } catch (error) {
        console.error("Error fetching recommended trails:", error);
      }
    };

    fetchRecommendedTrails();
  }, [currentLocation]);

  useEffect(() => {
    const fetchSavedTrails = async () => {
      try {
        const data = await getMarkedTrails();
        setSavedTrails(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching saved trails:", error);
      }
    };

    fetchSavedTrails();
  }, []);

  useEffect(() => {
    const fetchWeekChallenge = async () => {
      try {
        const data = await getChallenge();
        setWeekChallenge(data);

        if (data.week_distance >= 30) {
          setIsDistanceChallengeMet(true);
        }

        if (data.week_dogs >= 3) {
          setIsDogsChallengeMet(true);
        }
      } catch (error) {
        console.error("Error fetching week challenge:", error);
      }
    };

    fetchWeekChallenge();
  }, []);

  const handleBookmarkToggle = async (trail) => {
    const isBookmarked = savedTrails.some(
      (savedTrail) => savedTrail.name === trail.name,
    );
    try {
      if (isBookmarked) {
        const savedTrail = savedTrails.find(
          (savedTrail) => savedTrail.name === trail.name,
        );
        await deleteTrail(savedTrail.id); // id로 저장하기!
        setSavedTrails((prevTrails) =>
          prevTrails.filter((t) => t.id !== savedTrail.id),
        );
      } else {
        const data = await toggleTrail(trail);
        if (data.id) {
          setSavedTrails((prevTrails) => [...prevTrails, data]);
        } else {
          console.error("Failed to toggle bookmark:", data.IsEmptyMessage);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const isTrailBookmarked = (trail) =>
    savedTrails.some((savedTrail) => savedTrail.name === trail.name);

  return (
    <>
      <Header />
      <WalkDetailContainer>
        <ChallengeSection>
          <TitleWrapper>📢 이번 주 챌린지</TitleWrapper>
          <ChallengeStatus>
            주간 챌린지 달성 현황에 따라 멍을 획득할 수 있어요.
          </ChallengeStatus>
          <ChallengeItem $met={isDogsChallengeMet.toString()}>
            <ChallengeText>
              <ChallengeIcon src={walkingIcon} alt="walking" />
              3마리의 강아지와 산책하기
            </ChallengeText>
            <ChallengeBadge $met={isDogsChallengeMet.toString()}>
              15
              <FootprintIcon src={footprintIcon} alt="footprint" />
            </ChallengeBadge>
          </ChallengeItem>
          <ChallengeItem $met={isDistanceChallengeMet.toString()}>
            <ChallengeText>
              <ChallengeIcon src={walkingIcon} alt="walking" />총 30km 산책하기
            </ChallengeText>
            <ChallengeBadge $met={isDistanceChallengeMet.toString()}>
              20
              <FootprintIcon src={footprintIcon} alt="footprint" />
            </ChallengeBadge>
          </ChallengeItem>
        </ChallengeSection>
        <TitleWrapper>🏁 추천 산책로</TitleWrapper>
        <RecommendedTrail
          trails={recommendedTrails}
          handleBookmarkToggle={handleBookmarkToggle}
          isBookmarked={isTrailBookmarked}
        />
        <TitleWrapper>💘 내가 저장한 산책로</TitleWrapper>
        {savedTrails.length > 0 ? (
          <SavedTrail
            trails={savedTrails}
            handleBookmarkToggle={handleBookmarkToggle}
          />
        ) : (
          <IsEmptyMessage>아직 저장된 산책로가 없습니다.</IsEmptyMessage>
        )}
      </WalkDetailContainer>
      <Footer />
    </>
  );
};

export default WalkDetail;
