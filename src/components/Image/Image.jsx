import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledImage = styled.img`
  width: ${(props) => props.width || "60px"};
  height: ${(props) => props.height || "60px"};
  border-radius: ${(props) => props.borderRadius || "50%"};
  object-fit: cover;
  cursor: pointer;
  filter: brightness(1);
  transition: filter 0.5s ease;

  &:hover {
    filter: brightness(0.8); /* Hover 시 밝기를 낮춰줌 */
  }
`;

const Image = ({ src, width, height, borderRadius, onClick, ...rest }) => {
  return (
    <StyledImage
      src={src}
      width={width}
      height={height}
      borderRadius={borderRadius}
      onClick={onClick}
      {...rest}
    />
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  borderRadius: PropTypes.string,
  onClick: PropTypes.func,
};

Image.defaultProps = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  onClick: null,
};

export default Image;
