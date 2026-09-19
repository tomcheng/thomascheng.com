import styled from "styled-components";
import breakpoints from "../../utils/breakpoints";

const Container = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  margin-right: auto;
  margin-left: auto;

  @media (min-width: ${breakpoints.sm.min}px) {
    box-sizing: content-box;
    width: 704px;
  }
`;

export default Container;
