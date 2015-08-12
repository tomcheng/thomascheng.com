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
      secondFrameEnter: 8,
      bothFramesLeave: 16
    };
  },

  getInitialState() {
    return {
      currentFrame: 0,
      isPressed: false,
      images: shuffleArray(this.props.images)
    };
  },

  _handleTouchStart(evt) {
    evt.preventDefault();

    this.setState({
      isPressed: true,
      currentFrame: 0,
      images: shuffleArray(this.props.images)
    });
  },

  _handleTouchEnd() {
    this.setState({ isPressed: false });
  },

  render() {
    const {trigger, firstFrameEnter, bothFramesLeave, secondFrameEnter} = this.props,
          {currentFrame, isPressed, images} = this.state,
          isFlashing = isPressed && currentFrame <= images.length,
          isFinishedFlashing = currentFrame > images.length,
          isFinishedShowing = currentFrame > images.length + bothFramesLeave,
          showFirstFrame = isFinishedFlashing &&
                           currentFrame >= images.length + firstFrameEnter &&
                           currentFrame <= images.length + bothFramesLeave,
          showSecondFrame = isFinishedFlashing &&
                            currentFrame >= images.length + secondFrameEnter &&
                            currentFrame <= images.length + bothFramesLeave;

    if ((isPressed || isFinishedFlashing) && !isFinishedShowing) {
      setTimeout(() => {
        this.setState({ currentFrame: currentFrame + 1 });
      }, 60);
    }

    return (
      <div className={classNames({ "is-flashing": isFlashing })}>
        {images.map((image, i) => (
          <div
            key={image}
            className="image-flasher__image"
            style={{
              backgroundImage: "url(" + require("images/" + image) + ")",
              opacity: ((isPressed && i === currentFrame) ? 1 : 0)
             }}
          />
        ))}
        {showFirstFrame ? (
          <div style={{
            position: "fixed",
            textAlign: "center",
            left: 0,
            top: "20%",
            width: "100%"
          }}>
            Thank you. <span style={{ opacity: showSecondFrame ? 1 : 0}}>Come again.</span>
          </div>
        ) : null}
        <div
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
