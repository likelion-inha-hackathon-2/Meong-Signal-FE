import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import tagsData from "./tagsData.json";

const TagGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
`;

const TagWrapper = styled.div`
  display: inline-block;
  padding: 8px;
  margin: 4px;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${(props) =>
    props.selected ? "var(--yellow-color2)" : "var(--white-color)"};
  font-family: "PretendardR";
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: -0.11px;
`;

const Tag = ({ selectedTags = [], handleTagClick = () => {} }) => {
  return (
    <TagGridWrapper>
      {tagsData.map((tag) => (
        <TagWrapper
          key={tag.id}
          selected={selectedTags.includes(tag)}
          onClick={() => handleTagClick(tag)}
        >
          #{tag.label} {tag.emoji}
        </TagWrapper>
      ))}
    </TagGridWrapper>
  );
};

Tag.propTypes = {
  selectedTags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      emoji: PropTypes.string.isRequired,
    }),
  ),
  handleTagClick: PropTypes.func,
};

export default Tag;
