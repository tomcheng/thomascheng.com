import type { ReactNode } from "react";
import styled from "styled-components";

const Indicator = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 50%;
  margin-top: -8px;
  left: -16px;
  font-size: 16px;
  line-height: 16px;
  color: #333;
  transition: opacity 0.15s ease-in-out;
  opacity: ${props => (props.$isActive ? "1" : "0")};
`;

type ActiveIndicatorProps = {
  children: ReactNode;
  isActive: boolean;
  isMobile: boolean;
};

const ActiveIndicator = ({ isActive, isMobile, children }: ActiveIndicatorProps) => (
  <div style={{ position: "relative" }}>
    {!isMobile && <Indicator $isActive={isActive}>•</Indicator>}
    {children}
  </div>
);

export default ActiveIndicator;
