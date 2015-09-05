import React from "react/addons";
import classNames from "classnames";
import Animations from "utils/animations.jsx";
import Easings from "utils/easings.jsx";
import {constrain} from "utils/math.jsx"
import TouchHandler from "components/common/TouchHandler.jsx";

const mobilePadding = 15,
      dragConstant = 0.2, // how much scrolling slows down when dragging past bounds
      returnThreshold = 0.6; // how much dragging past end is needed to return to first image

export default React.createClass({
  mixins: [React.PureRenderMixin],

  propTypes: {
    description: React.PropTypes.string,
    height: React.PropTypes.number.isRequired,
    images: React.PropTypes.array.isRequired,
    isMobile: React.PropTypes.bool,
    slug: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    width: React.PropTypes.number.isRequired
  },

  getDefaultProps() {
    return {
      description: null,
      title: "",
      isMobile: false
    };
  },

  getInitialState() {
    return {
      dragDirection: null,
      isDragging: false,
      isDraggingHorizontally: false,
      scrollPos: 0,
      scrollPosAtDragStart: null,
      shouldWiggle: false,
      frameWidth: 1000
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
    const frameWidth = React.findDOMNode(this.refs.wrapper).offsetWidth,
          currentPane = this._getCurrentPane();

    this.setState({
      frameWidth: Math.max(frameWidth, 1),
      scrollPos: -frameWidth * currentPane
    });
  },

  _getCurrentPane() {
    const {scrollPos, frameWidth} = this.state,
          imageCount = this.props.images.length;

    return constrain(Math.floor(-scrollPos / frameWidth + 0.5), 0, imageCount - 1);
  },

  _getPrevPane() {
    const {scrollPos, frameWidth} = this.state,
          imageCount = this.props.images.length;

    return constrain(Math.floor(-scrollPos / frameWidth), 0, imageCount - 1);
  },

  _getNextPane() {
    const {scrollPos, frameWidth} = this.state,
          imageCount = this.props.images.length;

    return constrain(Math.ceil(-scrollPos / frameWidth), 0, imageCount - 1);
  },

  _animateToPane(pane, duration, easing) {
    Animations.animate({
      name: 'horizontalPan-' + this.props.slug,
      start: this.state.scrollPos,
      end: -this.state.frameWidth * pane,
      duration: duration,
      easing: easing,
      onUpdate: (pos) => {
        this.setState({ scrollPos: pos });
      }
    });
  },

  _handleDrag(evt) {
    const {deltaX, direction, preventDefault} = evt,
          {isDragging, isDraggingHorizontally, scrollPos, scrollPosAtDragStart, frameWidth} = this.state,
          {images} = this.props,
          imageCount = images.length;

    if (isDragging && isDraggingHorizontally) {
      preventDefault();
      let dragOffset = deltaX;
      if (scrollPosAtDragStart + deltaX > 0 ||
          scrollPosAtDragStart + deltaX < -frameWidth * (imageCount - 1)) {
        dragOffset *= dragConstant;
      };

      this.setState({
        scrollPos: scrollPosAtDragStart + dragOffset
      });
    }

    if (!isDragging) {
      Animations.stop('horizontalPan-' + this.props.slug);

      this.setState({
        isDragging: true,
        isDraggingHorizontally: direction === 'left' || direction === 'right',
        scrollPosAtDragStart: scrollPos
      });
    }
  },

  _handleDragRelease(evt) {
    const {deltaX, velocityX} = evt,
          {isDraggingHorizontally, scrollPos, frameWidth} = this.state,
          {images} = this.props,
          imageCount = images.length,
          currentPane = this._getCurrentPane();
    let destinationPane = currentPane, distanceToScroll, duration;

    if (isDraggingHorizontally) {
      if (scrollPos > 0 || imageCount === 1) {
        // scrollPosed out of bounds at start
        this._animateToPane(currentPane, 600, Easings.elasticOut);
      } else if (scrollPos < -frameWidth * (imageCount - 1)) {
        // scrollPosed out of bounds at end
        if (Math.abs(deltaX) > frameWidth * returnThreshold && imageCount > 1) {
          this._animateToPane(0, 120 * imageCount, Easings.cubicOut);
        } else {
          this._animateToPane(currentPane, 450, Easings.bounceOut);
        }
      } else {
        if (Math.abs(velocityX) > 0.05) {
          if (velocityX < 0) {
            destinationPane = this._getNextPane();
          }
          if (velocityX > 0) {
            destinationPane = this._getPrevPane();
          }
        }
        destinationPane = constrain(destinationPane, 0, imageCount - 1);
        distanceToScroll = Math.abs(-frameWidth * destinationPane - scrollPos);
        duration = constrain(Math.abs(distanceToScroll/velocityX*3), 200, 400);

        this._animateToPane(destinationPane, duration, Easings.cubicOut);
      }
    }

    this.setState({
      isDragging: false,
      isDraggingHorizontally: false,
      scrollPosAtDragStart: null
    });

  },

  _advanceToNextPane(evt) {
    const imageCount = this.props.images.length,
          currentPane = this._getCurrentPane(),
          nextPane = currentPane === imageCount - 1 ? 0 : currentPane + 1;

    if (imageCount === 1) {
      this.setState({ shouldWiggle: true });
      setTimeout(() => {
        this.setState({ shouldWiggle: false });
      }, 500);
    }

    if (nextPane === 0) {
      this._animateToPane(0, 150 * imageCount, Easings.returnHome);
    } else {
      this._animateToPane(nextPane, 350, Easings.cubicInOut);
    }
  },

  _renderCounter() {
    const imageCount = this.props.images.length;

    return (
      <div className="push-bottom-xs pull-right">
        {imageCount > 1 ? (
          <div className="carousel__header__counter" onClick={this._advanceToNextPane}>
            {this._getCurrentPane() + 1}&nbsp;of&nbsp;{imageCount}
          </div>
        ) : null}
      </div>
    );
  },

  render() {
    const {description, images, title, isMobile, height, width} = this.props,
          {scrollPos, frameWidth} = this.state,
          imageCount = images.length,
          indicatorFinalPosition = frameWidth * dragConstant * returnThreshold * 0.8,
          amountDraggedPastEnd = (-scrollPos/frameWidth - (imageCount - 1))/dragConstant,
          indicatorProgress = Easings.sineIn(constrain(amountDraggedPastEnd/returnThreshold, 0, 1)),
          imageWidth = isMobile ? frameWidth - 2 * mobilePadding : frameWidth,
          imageHeight = Math.round(height / width * imageWidth);

    return (
      <div className="carousel">
        {description ? (
          <div>
            <h4>{title}</h4>
            <div className="clearfix">
              <div className="push-bottom-xs pull-left">
                {description}
              </div>
              {this._renderCounter()}
            </div>
          </div>
        ) : (
          <div className="clearfix">
            <div className="push-bottom-xs pull-left">
              <h4>{title}</h4>
            </div>
            {this._renderCounter()}
          </div>
        )}
        <div
          className="carousel__wrapper"
          ref="wrapper"
          style={{
            marginLeft: isMobile ? -mobilePadding : 0,
            marginRight: isMobile ? -mobilePadding : 0
          }}>
          <TouchHandler
            onDrag={this._handleDrag}
            onDragRelease={this._handleDragRelease}
            onTap={this._advanceToNextPane}>
            <div
              className={classNames("carousel__frame", {
                "wiggle": this.state.shouldWiggle
              })}
              style={{ frameWidth }}>
              <ul
                className="carousel__list"
                style={{
                  width: frameWidth * imageCount,
                  WebkitTransform: "translate3d(" + scrollPos + "px, 0, 0)",
                  transform: "translate3d(" + scrollPos + "px, 0, 0)"
                }}>
                {images.map((image, index) => (
                  <li
                    key={index}
                    className="carousel__item"
                    style={{
                      width: frameWidth,
                      paddingLeft: isMobile ? mobilePadding : 0,
                      paddingRight: isMobile ? mobilePadding : 0
                    }}>
                    <img
                      className="carousel__image"
                      src={image}
                      style={{
                        width: imageWidth,
                        height: imageHeight
                      }}
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
                WebkitTransform: "translate3d(-" + indicatorProgress * indicatorFinalPosition + "px, 0, 0)",
                transform: "translate3d(-" + indicatorProgress * indicatorFinalPosition + "px, 0, 0)"
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
});
