import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Indicator = styled.div`
  position: absolute;
  top: 50%;
  margin-top: -8px;
  left: -16px;
  font-size: 16px;
  line-height: 16px;
  color: #333;
  transition: opacity 0.15s ease-in-out;
  opacity: ${props => (props.isActive ? "1" : "0")};
`;

const ActiveIndicator = ({ isActive, isMobile, children }) => (
  <div style={{ position: "relative" }}>
    {!isMobile && <Indicator isActive={isActive}>•</Indicator>}
    {children}
  </div>
);

ActiveIndicator.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired
};

export default ActiveIndicator;
