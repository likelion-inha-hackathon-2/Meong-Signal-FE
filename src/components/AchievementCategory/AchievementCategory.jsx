import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import IconDogEmoji from "../../assets/icons/icon-dogEmoji.png";
import Button from "../../components/Button/Button";

const Category = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-family: "PretendardB";
  margin-bottom: 10px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const Item = styled.li`
  background-color: var(--gray-color1);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  border: ${({ isRepresentative }) =>
    isRepresentative ? "3px solid var(--blue-color)" : "none"};
`;

const Header = styled.div`
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

const Text = styled.span`
  margin: 5px 0;
  font-family: "PretendardM";
`;

const Footer = styled.div`
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

const AchievementCategory = ({
  title,
  achievements,
  handleSetRepresentative,
  isRepresentative,
}) => (
  <Category>
    <Title>{title}</Title>
    <List>
      {achievements.map((achievement) => {
        const progress =
          (achievement.now_count / achievement.total_count) * 100;
        const unit = achievement.isWalking ? "km" : "번";
        const totalText = `${achievement.total_count}${unit}`;
        return (
          <Item
            key={achievement.id}
            isRepresentative={isRepresentative(achievement)}
          >
            <Header>
              <Text>
                {achievement.title} ({totalText})
              </Text>
              <StyledButton
                text="대표 업적 설정하기"
                onClick={() => handleSetRepresentative(achievement)}
              />
            </Header>
            <ProgressBar>
              <Progress $progress={progress}>
                <DogEmoji src={IconDogEmoji} $progress={progress} />
              </Progress>
            </ProgressBar>
            <Footer>
              <Text>
                {achievement.now_count} / {achievement.total_count}
              </Text>
              {achievement.is_achieved ? <Text>Completed!!</Text> : null}
            </Footer>
          </Item>
        );
      })}
    </List>
  </Category>
);

AchievementCategory.propTypes = {
  title: PropTypes.string.isRequired,
  achievements: PropTypes.array.isRequired,
  handleSetRepresentative: PropTypes.func.isRequired,
  isRepresentative: PropTypes.func.isRequired,
};

export default AchievementCategory;
