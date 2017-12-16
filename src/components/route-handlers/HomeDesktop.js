import React from "react";
import styled from "styled-components";
import RandomImage from "../common/RandomImage.js";

const RandomImageHome = styled(RandomImage)`
  margin-top: 25px;
  background-color: #ddd;
`;

const HomeDesktop = () => (
  <RandomImageHome
    images={[
      require("../../images/logos/logo_1.jpg"),
      require("../../images/logos/logo_2.jpg"),
      require("../../images/logos/logo_3.jpg"),
      require("../../images/logos/logo_4.jpg"),
      require("../../images/logos/logo_5.jpg"),
      require("../../images/logos/logo_6.jpg")
    ]}
  />
);

export default HomeDesktop;
