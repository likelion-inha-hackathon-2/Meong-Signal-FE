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
import { getChallenge } from "../../apis/getChallenge"; // getChallenge 함수 임포트
import footprintIcon from "../../assets/icons/icon-footprint.png";
import speakerIcon from "../../assets/icons/icon-speaker.png";
import walkingIcon from "../../assets/icons/icon-walking2.png";

const WalkDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  font-size: 20px;
  font-family: "PretendardS";
  margin: 0 15px;
`;

const ChallengeSection = styled.div`
  margin: 20px 15px;
`;

const ChallengeTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-family: "PretendardS";
  margin-bottom: 10px;
`;

const ChallengeTitleIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const ChallengeItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const ChallengeText = styled.div`
  display: flex;
  align-items: center;
  font-family: "PretendardR";
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
  background-color: ${props => (props.met ? "#32CD32" : "#ffcc00")}; // 조건을 달성하면 녹색으로 색상이 바뀌도록 설정  
  color: #fff;
  font-family: "PretendardS";
  padding: 6px;
  padding-left: 17px;
  border-radius: 6px;

`;

const FootprintIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 5px;
`;

const IsEmptyMessage = styled.p`
  padding-left: 20px;
  margin-top: 10px;
  font-family: "PretendardR";
  font-size: 14px;
`;

const WalkDetail = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [recommendedTrails, setRecommendedTrails] = useState([]);
  const [savedTrails, setSavedTrails] = useState([]);
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
        console.log("Week challenge data:", data);
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
      (savedTrail) => savedTrail.name === trail.name
    );
    try {
      if (isBookmarked) {
        const savedTrail = savedTrails.find(
          (savedTrail) => savedTrail.name === trail.name
        );
        await deleteTrail(savedTrail.id); // id로 저장하기!
        setSavedTrails((prevTrails) =>
          prevTrails.filter((t) => t.id !== savedTrail.id)
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
          <ChallengeTitle>
            <ChallengeTitleIcon src={speakerIcon} alt="speaker" />
            이번 주 챌린지
          </ChallengeTitle>
          <ChallengeItem>
            <ChallengeText>
              <ChallengeIcon src={walkingIcon} alt="walking" />
              3마리의 강아지와 산책하기
            </ChallengeText>
            <ChallengeBadge met={isDogsChallengeMet}>
              {weekChallenge.week_dogs}
              <FootprintIcon src={footprintIcon} alt="footprint" />
            </ChallengeBadge>
          </ChallengeItem>
          <ChallengeItem>
            <ChallengeText>
              <ChallengeIcon src={walkingIcon} alt="walking" />
              총 30km 산책하기
            </ChallengeText>
            <ChallengeBadge met={isDistanceChallengeMet}>
              {weekChallenge.week_distance}
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
