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
    slug: React.PropTypes.string.isRequired,
    startRatio: React.PropTypes.number
  },

  getDefaultProps() {
    return { startRatio: 0.025 };
  },

  getInitialState() {
    return {
      isDragging: false,
      ratioAtDragStart: null,
      ratio: this.props.startRatio,
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

    Animations.animate({
      name: "comparator-" + this.props.slug,
      start: this.state.ratio,
      end: this.props.startRatio,
      duration: 300,
      easing: Easings.cubicInOut,
      onUpdate: pos => {
        this.setState({ ratio: pos });
      }
    });
  },

  render() {
    const {before, after, title, description} = this.props,
          {isDragging, ratio, width} = this.state,
          aspectRatio = Math.max(before.height/before.width, after.height/after.width),
          height = Math.ceil(aspectRatio * width),
          handleClasses = classNames("comparator__handle", {
            "is-dragging": isDragging
          });

    return (
      <div>
        <div className="comparator">
          <div className="comparator__frame" ref="frame" style={{ height: height }}>
            <div
              className="comparator__outer-wrapper comparator__outer-wrapper--before"
              style={{ width: (width * ratio) }}>
              <div
                className="comparator__inner-wrapper comparator__inner-wrapper--before"
                style={{ width: width }}>
                <div className="comparator__label comparator__label--before">
                  Before
                </div>
                <img className="comparator__image" src={before.url} />
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
                <img className="comparator__image" src={after.url} />
              </div>
            </div>
          </div>
          <TouchHandler
            onDrag={this._handleDrag}
            onDragRelease={this._handleDragRelease} >
            <div className={handleClasses} style={{ left: (width * ratio) }}>
              <div className="comparator__handle__divider" />
              <div className="comparator__handle__handle" />
            </div>
          </TouchHandler>
        </div>
        <div className="comparator__info">
          <h4 className="comparator__info__title">{title}</h4>
          <div>{description}</div>
        </div>
      </div>
    );
  }
});

const constrain = (value, min, max) => Math.min(Math.max(value, min), max);
