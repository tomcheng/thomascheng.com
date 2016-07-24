import React from "react";
import classNames from "classnames";

const FIRST_FRAME_ENTER = 2;
const SECOND_FRAME_ENTER = 8;
const BOTH_FRAMES_LEAVE = 16;

const shuffleArray = array => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

class ImageFlasher extends React.Component {
  static propTypes = {
    images: React.PropTypes.array.isRequired,
    trigger: React.PropTypes.node.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      currentFrame: 0,
      isPressed: false,
      images: shuffleArray(this.props.images),
    };
  }

  handleTouchStart = evt => {
    evt.preventDefault();

    this.setState({
      isPressed: true,
      currentFrame: 0,
      images: shuffleArray(this.props.images),
    });
  };

  handleTouchEnd = () => {
    this.setState({ isPressed: false });
  };

  render () {
    const { trigger } = this.props;
    const { currentFrame, isPressed, images } = this.state;
    const isFlashing = isPressed && currentFrame <= images.length;
    const isFinishedFlashing = currentFrame > images.length;
    const isFinishedShowing = currentFrame > images.length + BOTH_FRAMES_LEAVE;
    const showFirstFrame = isFinishedFlashing &&
      currentFrame >= images.length + FIRST_FRAME_ENTER &&
      currentFrame <= images.length + BOTH_FRAMES_LEAVE;
    const showSecondFrame = isFinishedFlashing &&
      currentFrame >= images.length + SECOND_FRAME_ENTER &&
      currentFrame <= images.length + BOTH_FRAMES_LEAVE;

    if ((isPressed || isFinishedFlashing) && !isFinishedShowing) {
      setTimeout(() => {
        this.setState({ currentFrame: currentFrame + 1 });
      }, 60);
    }

    return (
      <div className={classNames({
        "is-flashing": isFlashing,
        "is-showing": (isPressed || isFinishedFlashing) && !isFinishedShowing,
      })}>
        <div className="image-flasher__image-container">
          {images.map((image, i) => (
            <div
              key={image}
              className="image-flasher__image"
              style={{
                backgroundImage: "url(" + image + ")",
                opacity: ((isPressed && i === currentFrame) ? 1 : 0),
              }}
            />
          ))}
        </div>
        <div className="image-flasher__message" style={{
          opacity: showFirstFrame ? 1 : 0,
        }}>
          Thank you.&nbsp;
          <span
            className="image-flasher__message__part"
            style={{ opacity: showSecondFrame ? 1 : 0 }}
          >
            Come again.
          </span>
        </div>
        <div
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}>
          {trigger}
        </div>
      </div>
    );
  }
}

export default ImageFlasher;
