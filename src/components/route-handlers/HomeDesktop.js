import React from "react";
import styled from "styled-components";
import RandomImage from "../common/RandomImage.js";
import img0 from "../../images/logos/logo_1.jpg";
import img1 from "../../images/logos/logo_2.jpg";
import img2 from "../../images/logos/logo_3.jpg";
import img3 from "../../images/logos/logo_4.jpg";
import img4 from "../../images/logos/logo_5.jpg";
import img5 from "../../images/logos/logo_6.jpg";

const RandomImageHome = styled(RandomImage)`
  margin-top: 25px;
  background-color: #ddd;
`;

const HomeDesktop = () => (
  <RandomImageHome
    images={[
      img0,
      img1,
      img2,
      img3,
      img4,
      img5
    ]}
  />
);

export default HomeDesktop;
