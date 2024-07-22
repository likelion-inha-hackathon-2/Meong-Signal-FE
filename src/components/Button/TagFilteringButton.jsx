import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Image from "../Image/Image";
import IconTagFitering from "../../assets/icons/icon-tag-filtering.png";

const StyledTageFilteringIcon = styled(Image)`
  width: 31px;
  height: 32px;
  position: absolute;
  right: 15px;
  bottom: 15px;
  z-index: 99;
  flex-shrink: 0;
`;

const TagFilteringButton = ({ onClick }) => {
  return <StyledTageFilteringIcon src={IconTagFitering} onClick={onClick} />;
};

TagFilteringButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default TagFilteringButton;
