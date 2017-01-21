import React from "react";
import styled from "styled-components";
import ImageFlasher from "../common/ImageFlasher.js";

const images = [
  require("../../images/home/3Dproj2-low-res.jpg"),
  require("../../images/home/circleboy.jpg"),
  require("../../images/home/circlewoman.jpg"),
  require("../../images/home/diabetes-low-res.jpg"),
  require("../../images/home/diagonal-stripe-man.jpg"),
  require("../../images/home/discowoman.jpg"),
  require("../../images/home/DSC_4252_small-low-res.jpg"),
  require("../../images/home/DSC_4757_small-low-res.jpg"),
  require("../../images/home/DSC_5209_small-low-res.jpg"),
  require("../../images/home/DSC_5211_small-low-res.jpg"),
  require("../../images/home/DSC_5230_small-low-res.jpg"),
  require("../../images/home/durer-low-res.jpg"),
  require("../../images/home/foodbrochure-low-res.jpg"),
  require("../../images/home/futura-1-low-res.jpg"),
  require("../../images/home/futura-5-low-res.jpg"),
  require("../../images/home/guide-1-low-res.jpg"),
  require("../../images/home/iheartyou-low-res.jpg"),
  require("../../images/home/influential-low-res.jpg"),
  require("../../images/home/localfood-low-res.jpg"),
  require("../../images/home/localfood2-low-res.jpg"),
  require("../../images/home/localfood3-low-res.jpg"),
  require("../../images/home/officers.jpg"),
  require("../../images/home/pcface1.jpg"),
  require("../../images/home/pcface2.jpg"),
  require("../../images/home/pcface4.jpg"),
  require("../../images/home/pcface5.jpg"),
  require("../../images/home/radiating.jpg"),
  require("../../images/home/robotgames-low-res.jpg"),
  require("../../images/home/scanface1.jpg"),
  require("../../images/home/squareman.jpg"),
  require("../../images/home/squareman2.jpg"),
  require("../../images/home/stripeman.jpg"),
  require("../../images/home/strippedfaces.jpg"),
  require("../../images/home/twofonts-low-res.jpg"),
];

const Footer = styled.div`
  position: fixed;
  bottom: 15px;
  left: 0;
  right: 0;
  text-align: center;
`;

const TriggerContainer = styled.div`
  left: 0;
  margin: -40px auto 0;
  position: fixed;
  right: 0;
  text-align: center;
  top: 50%;
  width: 250px;
  z-index: 1010;
`;

const Trigger = styled.div`
  font-family: Raleway, sans-serif;
  transition: all .06s ease-in;
  color: #333;
  font-weight: 900;
  text-transform: uppercase;
  font-size: 16px;
  letter-spacing: .5px;
  border-bottom: 8px solid #333;
  display: inline-block;
  padding: 0 10px 5px;
  margin-bottom: 15px;
  position: relative;

  .is-flashing & {
    color: #fff;
    border-color: #fff;
    -webkit-transform: scale3d(1.2, 1.2, 1);
    transform: scale3d(1.2, 1.2, 1);
  }
`;

const Subtitle = styled.div`
  .is-flashing & {
    opacity: 0;
  }
`;


const HomeMobile = () => (
  <div>
    <TriggerContainer>
      <ImageFlasher
        images={images}
        trigger={(
          <Trigger>Thomas Cheng</Trigger>
        )}
      />
      <Subtitle>
        <em>UI/UX Designer &amp;<br />Front-End Developer</em>
      </Subtitle>
    </TriggerContainer>
    <Footer>
      Contact: <a href="mailto:info@thomascheng.com">info@thomascheng.com</a>
    </Footer>
  </div>
);

export default HomeMobile;
