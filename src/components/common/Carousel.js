import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { findDOMNode } from "react-dom";
import Animations from "../../utils/animations.js";
import NudgeBottom from "./NudgeBottom";
import {
  bounceOut,
  cubicOut,
  cubicInOut,
  elasticOut,
  sineIn
} from "../../utils/easings.js";
import { constrain } from "../../utils/math.js";
import TouchHandler from "./TouchHandler.js";

const MOBILE_PADDING = 15;
const DRAG_CONSTANT = 0.2; // amount of slow down dragging past bounds
const RETURN_THRESHOLD = 0.6; // amount dragging past end to return to first image

const HeaderWithTitleOnly = styled(NudgeBottom)`
  display: flex;
  justify-content: space-between;
`;

const Counter = styled.div`
  user-select: none;
  color: #aaa;
  cursor: pointer;
  font-size: 12px;
  line-height: 19px;
  font-weight: 400;
  font-style: italic;
  align-self: flex-end;
  min-width: 45px;
  text-align: right;
`;

const wiggle = keyframes`
  100%, from {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0)
  }
  16.7%, 50%, 83.3% {
    -webkit-transform: translate3d(-8px, 0, 0);
    transform: translate3d(-8px, 0, 0)
  }
  33.3%, 67.7% {
    -webkit-transform: translate3d(8px, 0, 0);
    transform: translate3d(8px, 0, 0)
  }
`;

const Container = styled.div`
  overflow: hidden;
  position: relative;
  cursor: pointer;
  margin-left: ${props => (props.isMobile ? -MOBILE_PADDING + "px" : 0)};
  margin-right: ${props => (props.isMobile ? -MOBILE_PADDING + "px" : 0)};
  animation-name: ${props => (props.shouldWiggle ? wiggle : "")};
  animation-duration: .5s;
  animation-iteration-count: 1;
  animation-timing-function: ease-out;
`;

const List = styled.div`
  display: flex;
  user-select: none;
`;

const Item = styled.div`
  padding-left: ${props => (props.isMobile ? MOBILE_PADDING + "px" : "0")};
  padding-right: ${props => (props.isMobile ? MOBILE_PADDING + "px" : "0")};
`;

const Image = styled.img`
  display: block;

  @media (max-width: 767px) {
    border-radius: 3px;
    background-clip: padding-box;
  }
`;

const ReturnIndicator = styled.i`
  font-size: 20px;
  height: 20px;
  line-height: 20px;
  margin-top: -10px;
  position: absolute;
  right: -20px;
  text-align: center;
  top: 50%;
  width: 20px;
  opacity: ${props => props.indicatorProgress};
  transform: translate3d(
    -${props => props.indicatorProgress * props.indicatorFinalPosition}px,
    0,
    0
  );
`;

class Carousel extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    images: PropTypes.array.isRequired,
    isActive: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    slug: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    description: PropTypes.string,
    title: PropTypes.string
  };

  state = {
    dragDirection: null,
    isDragging: false,
    isDraggingHorizontally: false,
    scrollPos: 0,
    scrollPosAtDragStart: null,
    shouldWiggle: false,
    frameWidth: 1000
  };

  componentDidMount() {
    this.setDimensions();
    window.addEventListener("resize", this.setDimensions);
    window.addEventListener("orientationchange", this.setDimensions);
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (this.props.isMobile !== prevProps.isMobile) {
      this.setDimensions();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setDimensions);
    window.removeEventListener("orientationchange", this.setDimensions);
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  setDimensions = () => {
    const frameWidth = findDOMNode(this.wrapper).offsetWidth;
    const currentPane = this.getCurrentPane();

    this.setState({
      frameWidth: Math.max(frameWidth, 1),
      scrollPos: -frameWidth * currentPane
    });
  };

  handleKeyDown = evt => {
    if (!this.props.isActive) {
      return;
    }

    switch (evt.code) {
      case "ArrowRight":
        this.goToNextPane();
        break;
      case "ArrowLeft":
        this.goToPrevPane();
        break;
      default:
        break;
    }
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

    return constrain(Math.floor(-scrollPos / frameWidth), 0, imageCount - 1);
  };

  getNextPane = () => {
    const { scrollPos, frameWidth } = this.state;
    const imageCount = this.props.images.length;

    return constrain(Math.ceil(-scrollPos / frameWidth), 0, imageCount - 1);
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
      }
    });
  };

  handleDrag = evt => {
    const { deltaX, direction } = evt;
    const {
      isDragging,
      isDraggingHorizontally,
      scrollPos,
      scrollPosAtDragStart,
      frameWidth
    } = this.state;
    const { images } = this.props;
    const imageCount = images.length;

    if (isDragging && isDraggingHorizontally) {
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
        scrollPosAtDragStart: scrollPos
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
        // scrollPos out of bounds at start
        this.animateToPane(currentPane, 600, elasticOut);
      } else if (scrollPos < -frameWidth * (imageCount - 1)) {
        // scrollPos out of bounds at end
        if (
          Math.abs(deltaX) > frameWidth * RETURN_THRESHOLD &&
          imageCount > 1
        ) {
          this.animateToPane(0, 120 * imageCount, cubicOut);
        } else {
          this.animateToPane(currentPane, 450, bounceOut);
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
        distanceToScroll = Math.abs(-frameWidth * destinationPane - scrollPos);
        duration = constrain(
          Math.abs(distanceToScroll / velocityX * 3),
          200,
          400
        );

        this.animateToPane(destinationPane, duration, cubicOut);
      }
    }

    this.setState({
      isDragging: false,
      isDraggingHorizontally: false,
      scrollPosAtDragStart: null
    });
  };

  goToNextPane = () => {
    const imageCount = this.props.images.length;
    const currentPane = this.getCurrentPane();
    const nextPane = (currentPane + 1) % imageCount;

    if (imageCount === 1) {
      this.setState({ shouldWiggle: true });
      setTimeout(() => {
        this.setState({ shouldWiggle: false });
      }, 500);
      return;
    }

    if (nextPane === 0) {
      this.animateToPane(0, 150 * imageCount, cubicInOut);
    } else {
      this.animateToPane(nextPane, 350, cubicInOut);
    }
  };

  goToPrevPane = () => {
    const imageCount = this.props.images.length;
    const currentPane = this.getCurrentPane();
    const prevPane = currentPane === 0 ? imageCount - 1 : currentPane - 1;

    if (imageCount === 1) {
      this.setState({ shouldWiggle: true });
      setTimeout(() => {
        this.setState({ shouldWiggle: false });
      }, 500);
      return;
    }

    if (currentPane === 0) {
      this.animateToPane(prevPane, 150 * imageCount, cubicInOut);
    } else {
      this.animateToPane(prevPane, 350, cubicInOut);
    }
  };

  renderCounter = () =>
    this.props.images.length > 1
      ? <Counter onClick={this.goToNextPane}>
          {this.getCurrentPane() + 1}&nbsp;of&nbsp;{this.props.images.length}
        </Counter>
      : null;

  render() {
    const {
      description,
      images,
      title,
      isMobile,
      isActive,
      height,
      width
    } = this.props;
    const { scrollPos, frameWidth, shouldWiggle } = this.state;
    const imageCount = images.length;
    const indicatorFinalPosition =
      frameWidth * DRAG_CONSTANT * RETURN_THRESHOLD * 0.8;
    const amountDraggedPastEnd =
      (-scrollPos / frameWidth - (imageCount - 1)) / DRAG_CONSTANT;
    const indicatorProgress = sineIn(
      constrain(amountDraggedPastEnd / RETURN_THRESHOLD, 0, 1)
    );
    const imageWidth = isMobile ? frameWidth - 2 * MOBILE_PADDING : frameWidth;
    const imageHeight = Math.round(height / width * imageWidth);

    return (
      <div style={{ touchAction: "pan-y" }}>
        {description
          ? <NudgeBottom>
              <h4>
                {title}
              </h4>
              <NudgeBottom>
                {description}
              </NudgeBottom>
              <NudgeBottom>
                {this.renderCounter()}
              </NudgeBottom>
            </NudgeBottom>
          : <HeaderWithTitleOnly>
              <h4>
                {title}
              </h4>
              {this.renderCounter()}
            </HeaderWithTitleOnly>}
        <Container
          ref={el => {
            this.wrapper = el;
          }}
          isMobile={isMobile}
          isActive={isActive}
          shouldWiggle={shouldWiggle}
        >
          <TouchHandler
            onDrag={this.handleDrag}
            onDragRelease={this.handleDragRelease}
            onTap={this.goToNextPane}
          >
            <List
              style={{
                width: frameWidth * imageCount,
                WebkitTransform: "translate3d(" + scrollPos + "px, 0, 0)",
                transform: "translate3d(" + scrollPos + "px, 0, 0)"
              }}
            >
              {images.map((image, index) =>
                <Item
                  key={index}
                  isMobile={isMobile}
                  style={{ width: frameWidth }}
                >
                  <Image src={image} width={imageWidth} height={imageHeight} />
                </Item>
              )}
            </List>
          </TouchHandler>
          {imageCount > 1
            ? <ReturnIndicator
                className="fa fa-arrow-left"
                indicatorProgress={indicatorProgress}
                indicatorFinalPosition={indicatorFinalPosition}
              />
            : null}
        </Container>
      </div>
    );
  }
}

Carousel.defaultProps = {
  description: null,
  title: "",
  isMobile: false
};

export default Carousel;
