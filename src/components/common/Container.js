import styled from "styled-components";

const Container = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  margin-right: auto;
  margin-left: auto;

  @media (min-width: 768px) {
    width: 750px;
  }
  @media (min-width: 992px) {
    width: 970px;
  }
`;

export default Container;
