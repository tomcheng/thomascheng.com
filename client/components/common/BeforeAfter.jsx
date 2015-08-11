import React from "react";
import classNames from "classnames";

import Animations from "utils/animations.jsx";
import Easings from "utils/easings.jsx";

import TouchHandler from "components/common/TouchHandler.jsx";

export default React.createClass({
  propTypes: {
    before: React.PropTypes.object.isRequired,
    after: React.PropTypes.object.isRequired,
    description: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      showing: "after",
      width: 0,
      ratio: 1,
      isDragging: false,
      isDraggingHorizontally: false
    };
  },

  componentDidMount() {
    this._setDimensions();

    window.addEventListener("resize", this._setDimensions);
    window.addEventListener("orientationchange", this._setDimensions);
    window.addEventListener("scroll", this._setFixed);
  },

  componentWillUnmount() {
    window.removeEventListener("resize", this._setDimensions);
    window.removeEventListener("orientationchange", this._setDimensions);
    window.removeEventListener("scroll", this._setFixed);
  },

  _setDimensions() {
    this.setState({ width: React.findDOMNode(this.refs.frame).offsetWidth });
  },

  _switchToBefore() {
    this.setState({
      showing: "before",
    });

    Animations.animate({
      name: "before-after-" + this.props.slug,
      start: this.state.ratio,
      end: 0,
      duration: 250,
      easing: Easings.cubicInOut,
      onUpdate: pos => {
        this.setState({ ratio: pos });
      }
    });

  },

  _switchToAfter() {
    this.setState({
      showing: "after"
    });

    Animations.animate({
      name: "before-after-" + this.props.slug,
      start: this.state.ratio,
      end: 1,
      duration: 250,
      easing: Easings.cubicInOut,
      onUpdate: pos => {
        this.setState({ ratio: pos });
      }
    });
  },

  _toggleShowing() {
    if (this.state.showing === "before") {
      this._switchToAfter();
    } else {
      this._switchToBefore();
    }
  },

  _handleDrag({deltaX, direction, preventDefault}) {
    if (!this.state.isDragging) {
      this.setState({
        isDragging: true,
        ratioAtDragStart: this.state.ratio,
        isDraggingHorizontally: direction === "left" || direction === "right"
      });
    } else if (this.state.isDraggingHorizontally) {
      preventDefault();
      this.setState({
        ratio: constrain((this.state.ratioAtDragStart + deltaX / (this.state.width * 0.5 + 1)), 0, 1)
      });
    }

  },

  _handleDragRelease() {
    this.setState({
      isDragging: false,
      ratioAtDragStart: null,
      isDraggingHorizontally: false
    });
    if (this.state.ratio < 0.5) {
      this._switchToBefore();
    } else {
      this._switchToAfter();
    }
  },

  render() {
    const {before, after, title, description} = this.props,
          {showing, width, ratio} = this.state,
          aspectRatio = Math.max(before.height/before.width, after.height/after.width),
          height = Math.ceil(aspectRatio * width);

    return (
      <div>
        <div className="push-bottom-xs">
          <h4>{title}</h4>
          <div>{description}</div>
        </div>
        <TouchHandler
          onDrag={this._handleDrag}
          onDragRelease={this._handleDragRelease}
          onTap={this._toggleShowing}>
          <div className="before-after__buttons">
            <div className="before-after__buttons__background" />
            <div
              className="before-after__buttons__indicator-wrapper"
              style={{
                transform: "translate3d(" + (ratio * (width * 0.5 + 1)) + "px, 0, 0)"
              }}>
              <div className="before-after__buttons__indicator" />
            </div>
            <div
              onClick={this._switchToBefore}
              style={{ opacity: (0.2 + 0.8 * (1 - ratio)) }}
              className="before-after__button">
              Before
            </div>
            <div
              onClick={this._switchToAfter}
              style={{ opacity: (0.2 + 0.8 * ratio) }}
              className="before-after__button">
              After
            </div>
          </div>
        </TouchHandler>
        <div className="before-after" onClick={this._toggleShowing}>
          <div className="before-after__frame" ref="frame" style={{ height }}>
            <div
              className="comparator__outer-wrapper comparator__outer-wrapper--before"
              style={{ width: (width * ratio) }}>
              <div
                className="comparator__inner-wrapper comparator__inner-wrapper--before"
                style={{ width }}>
                <div className="comparator__label comparator__label--before">
                  Before
                </div>
                <img className="comparator__image" src={after.url} />
              </div>
            </div>
            <div
              className="comparator__outer-wrapper comparator__outer-wrapper--after"
              style={{ width: (width * (1 - ratio)) }}>
              <div
                className="comparator__inner-wrapper comparator__inner-wrapper--after"
                style={{ width }}>
                <div className="comparator__label comparator__label--after">
                  After
                </div>
                <img className="comparator__image" src={before.url} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

const constrain = (value, min, max) => Math.min(Math.max(value, min), max);
