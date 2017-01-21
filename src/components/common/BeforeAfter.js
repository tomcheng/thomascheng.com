import React from "react";
import Animations from "../../utils/animations.js";
import { cubicInOut } from "../../utils/easings.js";
import TouchHandler from "./TouchHandler.js";

const constrain = (value, min, max) => Math.min(Math.max(value, min), max);

class BeforeAfter extends React.Component {
  static propTypes = {
    after: React.PropTypes.object.isRequired,
    before: React.PropTypes.object.isRequired,
    description: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    sliderWidth: React.PropTypes.number,
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
    this.setState({ width: this.frame.offsetWidth });
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
          this.state.ratioAtDragStart + deltaX / (this.props.sliderWidth * 0.5),
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
    const { before, after, title, description, sliderWidth } = this.props;
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
        <h4>{title}</h4>
        <div className="clearfix">
          <div className="push-bottom-xs pull-left">
            <div>{description}</div>
          </div>
          <div className="push-bottom-xs pull-right">
            <TouchHandler
              onDrag={this.handleDragSlider}
              onDragRelease={this.handleDragRelease}
              onTap={this.handleTap}>
              <BeforeAfterSlider
                ratio={ratio}
                width={sliderWidth}
              />
            </TouchHandler>
          </div>
        </div>

        <TouchHandler
          onDrag={this.handleDragFull}
          onDragRelease={this.handleDragRelease}
          onTap={this.handleTap}
        >
          <div>
            <div className="before-after__browser-chrome"></div>
            <div
              className="before-after before-after--browser"
              ref={el => { this.frame = el; }}
              style={{ height }}
            >
              <div
                className="before-after__outer-wrapper before-after__outer-wrapper--after"
                style={{ width: (width * ratio) }}>
                <div
                  className="before-after__inner-wrapper before-after__inner-wrapper--after"
                  style={{ width }}>
                  <img
                    className="before-after__image"
                    src={after.url}
                    style={{ maxWidth: after.width }}
                  />
                </div>
              </div>
              <div
                className="before-after__outer-wrapper before-after__outer-wrapper--before"
                style={{ width: (width * (1 - ratio)) }}>
                <div
                  className="before-after__inner-wrapper before-after__inner-wrapper--before"
                  style={{ width }}>
                  <img
                    className="before-after__image"
                    src={before.url}
                    style={{ maxWidth: before.width }}
                  />
                </div>
              </div>
            </div>
          </div>
        </TouchHandler>
      </div>
    );
  }
}

BeforeAfter.defaultProps = { sliderWidth: 130 };

const BeforeAfterSlider = ({ ratio, width }) => (
  <div style={{ width }}>
    <div className="before-after-buttons">
      <div className="before-after-buttons__background" />
      <div
        className="before-after-buttons__indicator"
        style={{
          WebkitTransform: "translate3d(" + (ratio * (width * 0.5 + 1)) + "px, 0, 0)",
          transform: "translate3d(" + (ratio * (width * 0.5 + 1)) + "px, 0, 0)",
        }}
      />
      <div
        style={{ opacity: (0.2 + 0.8 * (1 - ratio)) }}
        className="before-after-button"
      >
        Before
      </div>
      <div
        style={{ opacity: (0.2 + 0.8 * ratio) }}
        className="before-after-button"
      >
        After
      </div>
    </div>
  </div>
);

BeforeAfterSlider.propTypes = {
  ratio: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
};

export default BeforeAfter;
