import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledImage = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: ${(props) => props.borderRadius || "50%"};
  object-fit: cover;
  cursor: pointer;
  filter: brightness(1);
  transition: filter 0.5s ease;
`;

const Image = ({ src, width, height, alt = "default alt text", onClick }) => {
  return (
    <StyledImage
      src={src}
      width={width}
      height={height}
      alt={alt}
      onClick={onClick}
    />
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  alt: PropTypes.string,
  onClick: PropTypes.func,
};

export default Image;
