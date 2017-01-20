import React from "react";
import ImageFlasher from "../common/ImageFlasher.js";

const HomeMobile = () => (
  <div>
    <div className="image-flasher__trigger-container">
      <ImageFlasher
        images={images}
        trigger={(
          <div>
            <div className="home__title">Thomas Cheng</div>
          </div>
        )}
      />
      <div className="image-flasher__trigger-text">
        <div>
          <em>UI/UX Designer &amp;<br />Front-End Developer</em>
        </div>
      </div>
    </div>
    <div className="mobile-home-footer">
      Contact: <a href="mailto:info@thomascheng.com">info@thomascheng.com</a>
    </div>
  </div>
);

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

export default HomeMobile;
