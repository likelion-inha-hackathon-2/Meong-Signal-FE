import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TagWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px 9px;
  border-radius: 15px;
  background-color: white;
  border: 2px solid #d9d9d9;
`;

const TagText = styled.span`
  font-size: 16px;
  margin-right: 5px;
`;

const TagEmoji = styled.span`
  font-size: 18px;
`;

const Tag = ({ text, emoji }) => {
  return (
    <TagWrapper>
      <TagText>#{text}</TagText>
      <TagEmoji>{emoji}</TagEmoji>
    </TagWrapper>
  );
};

Tag.propTypes = {
  text: PropTypes.string.isRequired,
  emoji: PropTypes.string.isRequired
};

export default Tag;
