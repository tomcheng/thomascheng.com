import React from "react";
import classNames from "classnames";
import _ from "lodash";

import svgTag from "utils/svgTag.jsx";

export default React.createClass({
  getDefaultProps() {
    return {
      images: [
        "3Dproj2-low-res.jpg",
        "circleboy.jpg",
        "circlewoman.jpg",
        "diabetes-low-res.jpg",
        "diagonal-stripe-man.jpg",
        "discowoman.jpg",
        "dotsman.jpg",
        "DSC_3961_small-low-res.jpg",
        "DSC_4211_small-low-res.jpg",
        "DSC_4252_small-low-res.jpg",
        "DSC_4757_small-low-res.jpg",
        "DSC_5061_small-low-res.jpg",
        "DSC_5209_small-low-res.jpg",
        "DSC_5211_small-low-res.jpg",
        "DSC_5230_small-low-res.jpg",
        "durer-low-res.jpg",
        "foodbrochure-low-res.jpg",
        "futura-1-low-res.jpg",
        "futura-5-low-res.jpg",
        "guide-1-low-res.jpg",
        "iheartyou-low-res.jpg",
        "influential-low-res.jpg",
        "localfood-low-res.jpg",
        "localfood2-low-res.jpg",
        "localfood3-low-res.jpg",
        "officers.jpg",
        "pcface1.jpg",
        "pcface2.jpg",
        "pcface3.jpg",
        "pcface4.jpg",
        "pcface5.jpg",
        "pcface6.jpg",
        "pcface7.jpg",
        "pixelwoman.jpg",
        "radiating.jpg",
        "robotgames-low-res.jpg",
        "scanface1.jpg",
        "squareman.jpg",
        "squareman2.jpg",
        "stripeman.jpg",
        "strippedfaces.jpg",
        "tapestry.jpg",
        "twofonts-low-res.jpg"
      ]
    }
  },

  getInitialState() {
    return {
      frame: 0,
      isPressed: false,
      images: shuffleArray(this.props.images)
    };
  },

  _handleTouchStart(evt) {
    evt.preventDefault();

    this.setState({
      isPressed: true,
      frame: 0,
      images: shuffleArray(this.props.images)
    });
  },

  _handleTouchEnd() {
    this.setState({ isPressed: false });
  },

  render() {
    const {frame, isPressed, images, firstFrame, secondFrame} = this.state,
          frameDuration = 2,
          isFlashing = isPressed && frame <= images.length,
          showFirstFrame = isPressed &&
                           frame >= images.length + frameDuration &&
                           frame <= images.length + frameDuration * 3,
          showSecondFrame = isPressed &&
                            frame >= (images.length + frameDuration * 2 + 1) &&
                            frame <= images.length + frameDuration * 3;

    if (isPressed) {
      setTimeout(() => {
        this.setState({ frame: frame + 1 });
      }, 60);
    }

    return (
      <div>
        {images.map((image, i) => (
          <div
            key={image}
            className="image-flasher__image"
            style={{
              backgroundImage: "url(" + require("images/home/" + image) + ")",
              opacity: ((isPressed && i === frame) ? 1 : 0)
             }}
          />
        ))}
        {showFirstFrame ? (
          <div style={{
            position: "absolute",
            textAlign: "center",
            left: 0,
            top: "15%",
            width: "100%"
          }}>
            Thank you. <span style={{ opacity: showSecondFrame ? 1 : 0}}>Come again.</span>
          </div>
        ) : null}
        <div className="image-flasher__content-container">
          <div
            className={classNames("image-flasher__trigger", {
              "is-flashing": isFlashing
            })}
            onTouchStart={this._handleTouchStart}
            onTouchEnd={this._handleTouchEnd}
            dangerouslySetInnerHTML={{__html: svgTag}}
          />
          <div style={{ opacity: isFlashing ? 0 : 1 }}>
            <div><strong>Thomas Cheng</strong></div>
            <div><em>UI/UX Designer &amp; Front-End Developer</em></div>
          </div>
        </div>
      </div>
    );
  }
});

const shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

