import React from "react";
import classNames from "classnames";
import TouchHandler from 'components/common/TouchHandler.jsx';
import Animations from 'utils/animations.jsx';
import Easings from 'utils/easings.jsx';

export default React.createClass({
  propTypes: {
    before: React.PropTypes.object.isRequired,
    after: React.PropTypes.object.isRequired,
    description: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      isDragging: false,
      ratioAtDragStart: null,
      ratio: 0.5,
      width: null
    };
  },

  componentDidMount() {
    this._setDimensions();

    window.addEventListener('resize', this._setDimensions);
    window.addEventListener('orientationchange', this._setDimensions);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._setDimensions);
    window.removeEventListener('orientationchange', this._setDimensions);
  },

  _setDimensions() {
    this.setState({ width: React.findDOMNode(this.refs.frame).offsetWidth });
  },

  _handleDrag(evt) {
    const {isDragging, ratio, ratioAtDragStart, width} = this.state,
          {deltaX, preventDefault} = evt;

    if (isDragging) {
      preventDefault();
      this.setState({
        ratio: constrain(ratioAtDragStart + (deltaX / width), 0, 1)
      });
    } else {
      this.setState({
        isDragging: true,
        ratioAtDragStart: ratio
      });
    }
  },

  _handleDragRelease() {
    this.setState({ isDragging: false });
  },

  _handleBeforeClick() {
    Animations.animate({
      name: "comparator-" + this.props.slug,
      start: this.state.ratio,
      end: 0,
      duration: 300,
      easing: Easings.cubicInOut,
      onUpdate: pos => {
        this.setState({ ratio: pos });
      }
    });
  },

  _handleAfterClick() {
    Animations.animate({
      name: "comparator-" + this.props.slug,
      start: this.state.ratio,
      end: 1,
      duration: 300,
      easing: Easings.cubicInOut,
      onUpdate: pos => {
        this.setState({ ratio: pos });
      }
    });
  },

  render() {
    const {before, after} = this.props,
          {isDragging, ratio, width} = this.state,
          aspectRatio = Math.max(before.height/before.width, after.height/after.width),
          height = Math.ceil(aspectRatio * width),
          handleClasses = classNames("comparator__handle", {
            "is-dragging": isDragging
          });

    return (
      <div className="comparator push-bottom">
        <div className="comparator__frame" ref="frame" style={{ height: height }}>
          <div
            className="comparator__outer-wrapper comparator__outer-wrapper--before"
            style={{ width: (width * ratio) }}>
            <div
              className="comparator__inner-wrapper comparator__inner-wrapper--before"
              style={{ width: width }}>
              <div style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "rgba(0,0,0,0.1)"
              }} />
              <div className="comparator__label comparator__label--before">
                Before
              </div>
              <img
                className="comparator__image"
                src={before.url}
                onClick={this._handleBeforeClick} />
            </div>
          </div>
          <div
            className="comparator__outer-wrapper comparator__outer-wrapper--after"
            style={{ width: (width * (1 - ratio)) }}>
            <div
              className="comparator__inner-wrapper comparator__inner-wrapper--after"
              style={{ width: width }}>
              <div className="comparator__label comparator__label--after">
                After
              </div>
              <img
                className="comparator__image"
                src={after.url}
                style={{ width: width }}
                onClick={this._handleAfterClick} />
            </div>
          </div>
        </div>
        <TouchHandler
          onDrag={this._handleDrag}
          onDragRelease={this._handleDragRelease} >
          <div className={handleClasses} style={{ left: (width * ratio) }}>
            <i className="comparator__handle__indicator-top fa fa-caret-down" />
            <i className="comparator__handle__indicator-bottom fa fa-caret-up" />
            <div className="comparator__handle__divider" />
          </div>
        </TouchHandler>
      </div>
    );
  }
});

const constrain = (value, min, max) => Math.min(Math.max(value, min), max);
