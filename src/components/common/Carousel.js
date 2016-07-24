import React from "react";
import classNames from "classnames";
import Animations from "utils/animations.js";
import Easings from "utils/easings.js";
import { constrain } from "utils/math.js";
import TouchHandler from "components/common/TouchHandler.js";

const MOBILE_PADDING = 15;
const DRAG_CONSTANT = 0.2; // amount of slow down dragging past bounds
const RETURN_THRESHOLD = 0.6; // amount dragging past end to return to first image

class Carousel extends React.Component {
  static propTypes = {
    height: React.PropTypes.number.isRequired,
    images: React.PropTypes.array.isRequired,
    slug: React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired,
    description: React.PropTypes.string,
    isMobile: React.PropTypes.bool,
    title: React.PropTypes.string,
  };

  constructor (props) {
    super(props);

    this.state = {
      dragDirection: null,
      isDragging: false,
      isDraggingHorizontally: false,
      scrollPos: 0,
      scrollPosAtDragStart: null,
      shouldWiggle: false,
      frameWidth: 1000,
    };
  }

  componentDidMount () {
    this.setDimensions();
    window.addEventListener("resize", this.setDimensions);
    window.addEventListener("orientationchange", this.setDimensions);
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.setDimensions);
    window.removeEventListener("orientationchange", this.setDimensions);
  }

  setDimensions = () => {
    const frameWidth = this.wrapper.offsetWidth;
    const currentPane = this.getCurrentPane();

    this.setState({
      frameWidth: Math.max(frameWidth, 1),
      scrollPos: -frameWidth * currentPane,
    });
  };

  getCurrentPane = () => {
    const { scrollPos, frameWidth } = this.state;
    const imageCount = this.props.images.length;

    return constrain(
      Math.floor(-scrollPos / frameWidth + 0.5),
      0,
      imageCount - 1
    );
  };

  getPrevPane = () => {
    const { scrollPos, frameWidth } = this.state;
    const imageCount = this.props.images.length;

    return constrain(
      Math.floor(-scrollPos / frameWidth),
      0,
      imageCount - 1
    );
  };

  getNextPane = () => {
    const { scrollPos, frameWidth } = this.state;
    const imageCount = this.props.images.length;

    return constrain(
      Math.ceil(-scrollPos / frameWidth),
      0,
      imageCount - 1
    );
  };

  animateToPane = (pane, duration, easing) => {
    Animations.animate({
      name: "horizontalPan-" + this.props.slug,
      start: this.state.scrollPos,
      end: -this.state.frameWidth * pane,
      duration,
      easing,
      onUpdate: scrollPos => {
        this.setState({ scrollPos });
      },
    });
  };

  handleDrag = evt => {
    const { deltaX, direction, preventDefault } = evt;
    const {
      isDragging,
      isDraggingHorizontally,
      scrollPos,
      scrollPosAtDragStart,
      frameWidth,
    } = this.state;
    const { images } = this.props;
    const imageCount = images.length;

    if (isDragging && isDraggingHorizontally) {
      preventDefault();
      let dragOffset = deltaX;
      if (
        scrollPosAtDragStart + deltaX > 0 ||
        scrollPosAtDragStart + deltaX < -frameWidth * (imageCount - 1)
      ) {
        dragOffset *= DRAG_CONSTANT;
      }

      this.setState({ scrollPos: scrollPosAtDragStart + dragOffset });
    }

    if (!isDragging) {
      Animations.stop("horizontalPan-" + this.props.slug);

      this.setState({
        isDragging: true,
        isDraggingHorizontally: direction === "left" || direction === "right",
        scrollPosAtDragStart: scrollPos,
      });
    }
  };

  handleDragRelease = evt => {
    const { deltaX, velocityX } = evt;
    const { isDraggingHorizontally, scrollPos, frameWidth } = this.state;
    const { images } = this.props;
    const imageCount = images.length;
    const currentPane = this.getCurrentPane();
    let destinationPane = currentPane;
    let distanceToScroll;
    let duration;

    if (isDraggingHorizontally) {
      if (scrollPos > 0 || imageCount === 1) {
        // scrollPosed out of bounds at start
        this.animateToPane(currentPane, 600, Easings.elasticOut);
      } else if (scrollPos < -frameWidth * (imageCount - 1)) {
        // scrollPosed out of bounds at end
        if (Math.abs(deltaX) > frameWidth * RETURN_THRESHOLD && imageCount > 1) {
          this.animateToPane(0, 120 * imageCount, Easings.cubicOut);
        } else {
          this.animateToPane(currentPane, 450, Easings.bounceOut);
        }
      } else {
        if (Math.abs(velocityX) > 0.05) {
          if (velocityX < 0) {
            destinationPane = this.getNextPane();
          }
          if (velocityX > 0) {
            destinationPane = this.getPrevPane();
          }
        }
        destinationPane = constrain(destinationPane, 0, imageCount - 1);
        distanceToScroll = Math.abs(-frameWidth * destinationPane - scrollPos);
        duration = constrain(Math.abs(distanceToScroll / velocityX * 3), 200, 400);

        this.animateToPane(destinationPane, duration, Easings.cubicOut);
      }
    }

    this.setState({
      isDragging: false,
      isDraggingHorizontally: false,
      scrollPosAtDragStart: null,
    });
  };

  handleAdvanceToNextPane = evt => {
    const imageCount = this.props.images.length;
    const currentPane = this.getCurrentPane();
    const nextPane = currentPane === imageCount - 1 ? 0 : currentPane + 1;

    if (imageCount === 1) {
      this.setState({ shouldWiggle: true });
      setTimeout(() => {
        this.setState({ shouldWiggle: false });
      }, 500);
    }

    if (nextPane === 0) {
      this.animateToPane(0, 150 * imageCount, Easings.returnHome);
    } else {
      this.animateToPane(nextPane, 350, Easings.cubicInOut);
    }
  };

  getCounter = () => (
    <div className="push-bottom-xs pull-right">
      {this.props.images.length > 1 ? (
        <div
          className="carousel__header__counter"
          onClick={this.handleAdvanceToNextPane}
        >
          {this.getCurrentPane() + 1}&nbsp;of&nbsp;{this.props.images.length}
        </div>
      ) : null}
    </div>
  );

  render () {
    const { description, images, title, isMobile, height, width } = this.props;
    const { scrollPos, frameWidth } = this.state;
    const imageCount = images.length;
    const indicatorFinalPosition = frameWidth * DRAG_CONSTANT * RETURN_THRESHOLD * 0.8;
    const amountDraggedPastEnd = (-scrollPos / frameWidth - (imageCount - 1)) / DRAG_CONSTANT;
    const indicatorProgress = Easings.sineIn(
      constrain(amountDraggedPastEnd / RETURN_THRESHOLD, 0, 1)
    );
    const imageWidth = isMobile ? frameWidth - 2 * MOBILE_PADDING : frameWidth;
    const imageHeight = Math.round(height / width * imageWidth);

    return (
      <div className="carousel">
        {description ? (
          <div>
            <h4>{title}</h4>
            <div className="clearfix">
              <div className="push-bottom-xs pull-left">
                {description}
              </div>
              {this.getCounter()}
            </div>
          </div>
        ) : (
          <div className="clearfix">
            <div className="push-bottom-xs pull-left">
              <h4>{title}</h4>
            </div>
            {this.getCounter()}
          </div>
        )}
        <div
          className="carousel__wrapper"
          ref={el => { this.wrapper = el; }}
          style={{
            marginLeft: isMobile ? -MOBILE_PADDING : 0,
            marginRight: isMobile ? -MOBILE_PADDING : 0,
          }}>
          <TouchHandler
            onDrag={this.handleDrag}
            onDragRelease={this.handleDragRelease}
            onTap={this.handleAdvanceToNextPane}>
            <div
              className={classNames("carousel__frame", {
                "wiggle": this.state.shouldWiggle,
              })}
              style={{ frameWidth }}
            >
              <ul
                className="carousel__list"
                style={{
                  width: frameWidth * imageCount,
                  WebkitTransform: "translate3d(" + scrollPos + "px, 0, 0)",
                  transform: "translate3d(" + scrollPos + "px, 0, 0)",
                }}
              >
                {images.map((image, index) => (
                  <li
                    key={index}
                    className="carousel__item"
                    style={{
                      width: frameWidth,
                      paddingLeft: isMobile ? MOBILE_PADDING : 0,
                      paddingRight: isMobile ? MOBILE_PADDING : 0,
                    }}
                  >
                    <img
                      className="carousel__image"
                      src={image}
                      width={imageWidth}
                      height={imageHeight}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </TouchHandler>
          {imageCount > 1 ? (
            <i
              className="carousel__return-indicator fa fa-arrow-left"
              style={{
                opacity: indicatorProgress,
                WebkitTransform: "translate3d(-" +
                  indicatorProgress * indicatorFinalPosition + "px, 0, 0)",
                transform: "translate3d(-" +
                  indicatorProgress * indicatorFinalPosition + "px, 0, 0)",
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

Carousel.defaultProps = {
  description: null,
  title: "",
  isMobile: false,
};

export default Carousel;
