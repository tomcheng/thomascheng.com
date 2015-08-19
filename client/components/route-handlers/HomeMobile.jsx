import React from "react";
import classNames from "classnames";

import svgTag from "utils/svgTag.jsx";
import ImageFlasher from "components/common/ImageFlasher.jsx";

export default React.createClass({
  _getTrigger() {
    return (
      <div>
        <div
          className="image-flasher__trigger-logo"
          dangerouslySetInnerHTML={{__html: svgTag}}
        />
      </div>
    );
  },

  render() {
    return (
      <div className="image-flasher__trigger-container">
        <ImageFlasher
          images={images}
          trigger={this._getTrigger()}
        />
        <div className="image-flasher__trigger-text">
          <div><strong>Thomas Cheng</strong></div>
          <div><em>UI/UX Designer &amp; Front-End Developer</em></div>
        </div>
      </div>
    );
  },
});

const images = [
  require("images/home/3Dproj2-low-res.jpg"),
  require("images/home/circleboy.jpg"),
  require("images/home/circlewoman.jpg"),
  require("images/home/diabetes-low-res.jpg"),
  require("images/home/diagonal-stripe-man.jpg"),
  require("images/home/discowoman.jpg"),
  require("images/home/dotsman.jpg"),
  require("images/home/DSC_4252_small-low-res.jpg"),
  require("images/home/DSC_4757_small-low-res.jpg"),
  require("images/home/DSC_5209_small-low-res.jpg"),
  require("images/home/DSC_5211_small-low-res.jpg"),
  require("images/home/DSC_5230_small-low-res.jpg"),
  require("images/home/durer-low-res.jpg"),
  require("images/home/foodbrochure-low-res.jpg"),
  require("images/home/futura-1-low-res.jpg"),
  require("images/home/futura-5-low-res.jpg"),
  require("images/home/guide-1-low-res.jpg"),
  require("images/home/iheartyou-low-res.jpg"),
  require("images/home/influential-low-res.jpg"),
  require("images/home/localfood-low-res.jpg"),
  require("images/home/localfood2-low-res.jpg"),
  require("images/home/localfood3-low-res.jpg"),
  require("images/home/officers.jpg"),
  require("images/home/pcface1.jpg"),
  require("images/home/pcface2.jpg"),
  require("images/home/pcface4.jpg"),
  require("images/home/pcface5.jpg"),
  require("images/home/radiating.jpg"),
  require("images/home/robotgames-low-res.jpg"),
  require("images/home/scanface1.jpg"),
  require("images/home/squareman.jpg"),
  require("images/home/squareman2.jpg"),
  require("images/home/stripeman.jpg"),
  require("images/home/strippedfaces.jpg"),
  require("images/home/tapestry.jpg"),
  require("images/home/twofonts-low-res.jpg")
];
