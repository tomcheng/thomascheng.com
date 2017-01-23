import React from "react";
import { findDOMNode } from "react-dom";
import styled from "styled-components";
import Animations from "../../utils/animations.js";
import { cubicInOut } from "../../utils/easings.js";
import NudgeBottom from "./NudgeBottom";
import TouchHandler from "./TouchHandler.js";

const SLIDER_WIDTH = 130;

const constrain = (value, min, max) => Math.min(Math.max(value, min), max);

const Header = styled(NudgeBottom)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const SliderContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`;

const BrowserChrome = styled.div`
  border-radius: 3px 3px 0 0;
  background-clip: padding-box;
  height: 20px;
  background-color: #d2d2d2;
  position: relative;

  &:before {
    content: "•••";
    color: #fff;
    position: absolute;
    letter-spacing: 5px;
    font-size: 18px;
    line-height: 20px;
    top: 1px;
    left: 10px;
  }
`;

const Container = styled.div`
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  position: relative;
  cursor: pointer;
  border: 1px solid #d2d2d2;
  border-radius: 0 0 3px 3px;
  background-clip: padding-box;
  height: ${props => props.height + "px"};
`;

const OuterWrapperAfter = styled.div`
  position: absolute;
  overflow: hidden;
  bottom: 0;
  top: 0;
  left: 0;
  width: ${props => props.width * props.ratio}px;
  background-color: #fff;
`;

const InnerWrapperAfter = styled.div`
  width: ${props => props.width}px;
`;

const Image = styled.img`
  background-clip: padding-box;
  display: block;
  width: 100%;
  margin: 0 auto;
  border-radius: 0 0 3px 3px;
  background-clip: padding-box;
  max-width: ${props => props.maxWidth}px;
`;


class BeforeAfter extends React.Component {
  static propTypes = {
    after: React.PropTypes.object.isRequired,
    before: React.PropTypes.object.isRequired,
    slug: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      width: 0,
      ratio: 1,
      dragStartPosition: null,
      isDragging: false,
      isDraggingHorizontally: false,
    };
  }

  componentDidMount () {
    this.setDimensions();
    window.addEventListener("resize", this.setDimensions);
    window.addEventListener("orientationchange", this.setDimensions);
  };

  componentWillUnmount () {
    window.removeEventListener("resize", this.setDimensions);
    window.removeEventListener("orientationchange", this.setDimensions);
  };

  setDimensions = () => {
    this.setState({ width: findDOMNode(this.frame).offsetWidth });
  };

  switchToBefore = () => {
    Animations.animate({
      name: "before-after-" + this.props.slug,
      start: this.state.ratio,
      end: 0,
      duration: 250,
      easing: cubicInOut,
      onUpdate: ratio => {
        this.setState({ ratio });
      },
    });
  };

  switchToAfter = () => {
    Animations.animate({
      name: "before-after-" + this.props.slug,
      start: this.state.ratio,
      end: 1,
      duration: 250,
      easing: cubicInOut,
      onUpdate: ratio => {
        this.setState({ ratio });
      },
    });
  };

  handleTap = () => {
    if (this.state.ratio < 0.5) {
      this.switchToAfter();
    } else {
      this.switchToBefore();
    }
  };

  handleDragFull = ({ x, deltaX, direction, preventDefault }) => {
    if (!this.state.isDragging) {
      this.setState({
        isDragging: true,
        ratioAtDragStart: this.state.ratio,
        dragStartPosition: x,
        isDraggingHorizontally: direction === "left" || direction === "right",
      });
    } else if (this.state.isDraggingHorizontally) {
      preventDefault();
      this.setState({
        ratio: constrain(
          this.state.ratioAtDragStart + deltaX / (this.state.width * 0.7 + 1),
          0,
          1
        ),
      });
    }
  };

  handleDragSlider = ({ x, deltaX, direction, preventDefault }) => {
    if (!this.state.isDragging) {
      this.setState({
        isDragging: true,
        ratioAtDragStart: this.state.ratio,
        dragStartPosition: x,
        isDraggingHorizontally: direction === "left" || direction === "right",
      });
    } else if (this.state.isDraggingHorizontally) {
      preventDefault();
      this.setState({
        ratio: constrain(
          this.state.ratioAtDragStart + deltaX / (SLIDER_WIDTH * 0.5),
          0,
          1
        ),
      });
    }
  };

  handleDragRelease = () => {
    this.setState({
      isDragging: false,
      dragStartPosition: null,
      ratioAtDragStart: null,
      isDraggingHorizontally: false,
    });
    if (this.state.ratio < 0.5) {
      this.switchToBefore();
    } else {
      this.switchToAfter();
    }
  };

  render () {
    const { before, after, title } = this.props;
    const { width, ratio } = this.state;
    const beforeHeight = before.width < width
      ? before.height
      : before.height / before.width * width;
    const afterHeight = after.width < width
      ? after.height
      : after.height / after.width * width;
    const height = Math.ceil(Math.max(beforeHeight, afterHeight));

    return (
      <div>
        <Header>
          <h4>{title}</h4>
          <SliderContainer>
            <TouchHandler
              onDrag={this.handleDragSlider}
              onDragRelease={this.handleDragRelease}
              onTap={this.handleTap}>
              <BeforeAfterSlider ratio={ratio} />
            </TouchHandler>
          </SliderContainer>
        </Header>
        <TouchHandler
          onDrag={this.handleDragFull}
          onDragRelease={this.handleDragRelease}
          onTap={this.handleTap}
        >
          <BrowserChrome />
          <Container ref={el => { this.frame = el; }} height={height}>
            <Image
              alt={title + " - before"}
              src={before.url}
              maxWidth={before.width}
            />
            <OuterWrapperAfter width={width} ratio={ratio}>
              <InnerWrapperAfter width={width}>
                <Image
                  alt={title + " - after"}
                  src={after.url}
                  maxWidth={after.width}
                />
              </InnerWrapperAfter>
            </OuterWrapperAfter>
          </Container>
        </TouchHandler>
      </div>
    );
  }
}

const Slider = styled.div`
  position: relative;
  width: ${SLIDER_WIDTH}px;
  border-radius: 3px;
  background: linear-gradient(#e8e8e8, #eaeaea);
  border: 1px solid #e0e0e0;
  display: flex;
`;

const SliderOption = styled.div`
  user-select: none;
  cursor: pointer;
  float: left;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 9px;
  letter-spacing: 1px;
  line-height: 24px;
  text-transform: uppercase;
  flex-basis: 50%;
  text-align: center;
  z-index: 1;
  opacity: ${props => props.opacity};
`;

const Indicator = styled.div`
  bottom: 0;
  left: 0;
  position: absolute;
  top: 0;
  width: calc(50% - 2px);
  border-radius: 3px;
  background-clip: padding-box;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  transform: translate3d(${props => props.ratio * (SLIDER_WIDTH * 0.5 + 1)}px, 0, 0);
`;


const BeforeAfterSlider = ({ ratio }) => (
  <Slider>
    <Indicator ratio={ratio} />
    <SliderOption opacity={0.2 + 0.8 * (1 - ratio)}>
      Before
    </SliderOption>
    <SliderOption opacity={0.2 + 0.8 * ratio}>
      After
    </SliderOption>
  </Slider>
);

BeforeAfterSlider.propTypes = {
  ratio: React.PropTypes.number.isRequired,
};

export default BeforeAfter;
