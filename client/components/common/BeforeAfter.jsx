import React from "react";
import classNames from "classnames";
import Animations from "utils/animations.jsx";
import Easings from "utils/easings.jsx";
import TouchHandler from "components/common/TouchHandler.jsx";
import Annotation from "components/common/Annotation.jsx";

export default React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    before: React.PropTypes.object.isRequired,
    after: React.PropTypes.object.isRequired,
    annotations: React.PropTypes.array,
    slug: React.PropTypes.string.isRequired,
    showBrowserChrome: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      annotations: [],
      showBrowserChrome: true,
      sliderWidth: 120
    };
  },

  getInitialState() {
    return {
      width: 0,
      ratio: 1,
      dragStartPosition: null,
      isDragging: false,
      isDraggingHorizontally: false
    };
  },

  componentDidMount() {
    this._setDimensions();

    window.addEventListener("resize", this._setDimensions);
    window.addEventListener("orientationchange", this._setDimensions);
  },

  componentWillUnmount() {
    window.removeEventListener("resize", this._setDimensions);
    window.removeEventListener("orientationchange", this._setDimensions);
  },

  _setDimensions() {
    this.setState({ width: React.findDOMNode(this.refs.frame).offsetWidth });
  },

  _switchToBefore() {
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
    if (this.state.ratio < 0.5) {
      this._switchToAfter();
    } else {
      this._switchToBefore();
    }
  },

  _handleDragFull({x, deltaX, direction, preventDefault}) {
    if (!this.state.isDragging) {
      this.setState({
        isDragging: true,
        ratioAtDragStart: this.state.ratio,
        dragStartPosition: x,
        isDraggingHorizontally: direction === "left" || direction === "right"
      });
    } else if (this.state.isDraggingHorizontally) {
      preventDefault();
      this.setState({
        ratio: constrain((this.state.ratioAtDragStart + deltaX / (this.state.width * 0.75 + 1)), 0, 1)
      });
    }
  },

  _handleDragSlider({x, deltaX, direction, preventDefault}) {
    if (!this.state.isDragging) {
      this.setState({
        isDragging: true,
        ratioAtDragStart: this.state.ratio,
        dragStartPosition: x,
        isDraggingHorizontally: direction === "left" || direction === "right"
      });
    } else if (this.state.isDraggingHorizontally) {
      preventDefault();
      this.setState({
        ratio: constrain((this.state.ratioAtDragStart + deltaX / (this.props.sliderWidth * 0.5)), 0, 1)
      });
    }
  },

  _handleDragRelease() {
    this.setState({
      isDragging: false,
      dragStartPosition: null,
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
    const {before, after, annotations, title, description, showBrowserChrome, sliderWidth} = this.props,
          {showing, width, ratio} = this.state,
          aspectRatio = Math.max(before.height/before.width, after.height/after.width),
          height = Math.ceil(aspectRatio * width);

    return (
      <div>

        <div className="push-bottom-xs clearfix">
          <div className="pull-left">
            <h4>{title}</h4>
          </div>
          <div className="pull-right">
            <TouchHandler
              onDrag={this._handleDragSlider}
              onDragRelease={this._handleDragRelease}
              onTap={this._toggleShowing}>
              <BeforeAfterSlider
                ratio={ratio}
                width={sliderWidth}
              />
            </TouchHandler>
          </div>
        </div>

        <TouchHandler
          onDrag={this._handleDragFull}
          onDragRelease={this._handleDragRelease}
          onTap={this._toggleShowing}>

          {showBrowserChrome ? <div className="before-after__browser-chrome"></div> : null}

          <div className={classNames("before-after", {"before-after--browser": showBrowserChrome})} ref="frame" style={{ height }}>
            {annotations.map((annotation, i) => (
              <Annotation key={i} annotation={annotation} />
            ))}
            <div
              className="before-after__outer-wrapper before-after__outer-wrapper--after"
              style={{ width: (width * ratio) }}>
              <div
                className="before-after__inner-wrapper before-after__inner-wrapper--after"
                style={{ width }}>
                <img className="before-after__image" src={after.url} />
              </div>
            </div>
            <div
              className="before-after__outer-wrapper before-after__outer-wrapper--before"
              style={{ width: (width * (1 - ratio)) }}>
              <div
                className="before-after__inner-wrapper before-after__inner-wrapper--before"
                style={{ width }}>
                <img className="before-after__image" src={before.url} />
              </div>
            </div>
          </div>
        </TouchHandler>
      </div>
    );
  }
});

const constrain = (value, min, max) => Math.min(Math.max(value, min), max);

const BeforeAfterSlider = React.createClass({
  propTypes: {
    ratio: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired
  },

  render() {
    const {ratio, width} = this.props

    return (
      <div style={{width: width}}>
        <div className="before-after-buttons">
          <div className="before-after-buttons__background" />
          <div
            className="before-after-buttons__indicator"
            style={{
              transform: "translate3d(" + (ratio * (width * 0.5 + 1)) + "px, 0, 0)"
            }}
          />
          <div
            style={{ opacity: (0.2 + 0.8 * (1 - ratio)) }}
            className="before-after-button">
            Before
          </div>
          <div
            style={{ opacity: (0.2 + 0.8 * ratio) }}
            className="before-after-button">
            After
          </div>
        </div>
      </div>
    );
  }
})
