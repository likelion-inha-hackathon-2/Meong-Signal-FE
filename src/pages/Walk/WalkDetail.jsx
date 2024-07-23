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

const WalkDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// 저장된 산책로 데이터가 없다면 해당 메시지 출력
const Message = styled.p`
  font-size: 16px;
`;

const WalkDetail = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [recommendedTrails, setRecommendedTrails] = useState([]);
  const [savedTrails, setSavedTrails] = useState([]);

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
    // if (!currentLocation) return;

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
        setSavedTrails(
          (prevTrails) => prevTrails.filter((t) => t.id !== savedTrail.id), // 여기에서 savedTrail.id로 필터링
        );
      } else {
        const data = await toggleTrail(trail);
        if (data.id) {
          setSavedTrails((prevTrails) => [...prevTrails, data]);
        } else {
          console.error("Failed to toggle bookmark:", data.message);
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
        <RecommendedTrail
          trails={recommendedTrails}
          handleBookmarkToggle={handleBookmarkToggle}
          isBookmarked={isTrailBookmarked}
        />
        {savedTrails.length > 0 ? (
          <SavedTrail
            trails={savedTrails}
            handleBookmarkToggle={handleBookmarkToggle}
          />
        ) : (
          <Message>저장된 산책로 데이터가 없습니다.</Message>
        )}
      </WalkDetailContainer>
      <Footer />
    </>
  );
};

export default WalkDetail;
