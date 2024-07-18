import React from "react";
import styled from "styled-components";

const StyledImage = styled.img`
    width: ${(props) => props.width || "60px"};   // 기본 크기 넓이 60px, 높이 60px 고정
    height: ${(props) => props.height || "60px"};
    border-radius: ${(props) => props.borderRadius || "50%"};  // 이미지 기본 border 상태 원으로 고정
    object-fit: cover;
    cursor: pointer;
    filter: brightness(1.0);
    transition: filter 0.5s ease;
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

export default Image;
