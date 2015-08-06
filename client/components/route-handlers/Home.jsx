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
  "home/3Dproj2-low-res.jpg",
  "home/circleboy.jpg",
  "home/circlewoman.jpg",
  "home/diabetes-low-res.jpg",
  "home/diagonal-stripe-man.jpg",
  "home/discowoman.jpg",
  "home/dotsman.jpg",
  "home/DSC_3961_small-low-res.jpg",
  "home/DSC_4252_small-low-res.jpg",
  "home/DSC_4757_small-low-res.jpg",
  "home/DSC_5061_small-low-res.jpg",
  "home/DSC_5209_small-low-res.jpg",
  "home/DSC_5211_small-low-res.jpg",
  "home/DSC_5230_small-low-res.jpg",
  "home/durer-low-res.jpg",
  "home/foodbrochure-low-res.jpg",
  "home/futura-1-low-res.jpg",
  "home/futura-5-low-res.jpg",
  "home/guide-1-low-res.jpg",
  "home/iheartyou-low-res.jpg",
  "home/influential-low-res.jpg",
  "home/localfood-low-res.jpg",
  "home/localfood2-low-res.jpg",
  "home/localfood3-low-res.jpg",
  "home/officers.jpg",
  "home/pcface1.jpg",
  "home/pcface2.jpg",
  "home/pcface3.jpg",
  "home/pcface4.jpg",
  "home/pcface5.jpg",
  "home/pixelwoman.jpg",
  "home/radiating.jpg",
  "home/robotgames-low-res.jpg",
  "home/scanface1.jpg",
  "home/squareman.jpg",
  "home/squareman2.jpg",
  "home/stripeman.jpg",
  "home/strippedfaces.jpg",
  "home/tapestry.jpg",
  "home/twofonts-low-res.jpg"
];
