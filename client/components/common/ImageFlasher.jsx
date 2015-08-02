import React from "react";
import classNames from "classnames";

export default React.createClass({
  propTypes: {
    images: React.PropTypes.array.isRequired,
    trigger: React.PropTypes.node.isRequired
  },

  getDefaultProps() {
    return {
      firstFrameEnter: 2,
      secondFrameEnter: 6,
      bothFramesLeave: 10
    };
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
    const {trigger, firstFrameEnter, bothFramesLeave, secondFrameEnter} = this.props,
          {frame, isPressed, images, firstFrame, secondFrame} = this.state,
          frameDuration = 2,
          isFlashing = isPressed && frame <= images.length,
          showFirstFrame = isPressed &&
                           frame >= images.length + firstFrameEnter &&
                           frame <= images.length + bothFramesLeave,
          showSecondFrame = isPressed &&
                            frame >= images.length + secondFrameEnter &&
                            frame <= images.length + bothFramesLeave;

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
              backgroundImage: "url(" + require("images/" + image) + ")",
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
        <div
          className={classNames("image-flasher__trigger-container", {
            "is-flashing": isFlashing
          })}
          onTouchStart={this._handleTouchStart}
          onTouchEnd={this._handleTouchEnd}>
          {trigger}
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
