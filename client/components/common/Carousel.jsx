import React from 'react';
import classNames from 'classnames';
import Animations from 'utils/animations.jsx';
import Easings from 'utils/easings.jsx';
import TouchHandler from 'components/common/TouchHandler.jsx';

export default React.createClass({
  propTypes: {
    description: React.PropTypes.string.isRequired,
    dragConstant: React.PropTypes.number,               // how much scrollPosing slows down when dragging past bounds
    images: React.PropTypes.array.isRequired,
    originalHeight: React.PropTypes.number.isRequired,
    originalWidth: React.PropTypes.number.isRequired,
    returnThreshold: React.PropTypes.number.isRequired, // how much dragging past end is needed to return to first image
    slug: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired
  },

  getDefaultProps() {
    return {
      dragConstant: 0.2,
      returnThreshold: 0.6
    };
  },

  getInitialState() {
    return {
      dragDirection: null,
      height: 0,
      isDragging: false,
      isDraggingHorizontally: false,
      scrollPos: 0,
      scrollPosAtDragStart: null,
      width: 0
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
    const wrapperWidth = React.findDOMNode(this.refs.wrapper).offsetWidth,
          {originalWidth, originalHeight} = this.props;

    this.setState({
      width: wrapperWidth,
      height: wrapperWidth / originalWidth * originalHeight
    });
  },

  _getCurrentPane() {
    const {scrollPos, width} = this.state,
          imageCount = this.props.images.length;

    return constrain(Math.floor(-scrollPos / width + 0.5), 0, imageCount - 1);
  },

  _getPrevPane() {
    const {scrollPos, width} = this.state,
          imageCount = this.props.images.length;

    return constrain(Math.floor(-scrollPos / width), 0, imageCount - 1);
  },

  _getNextPane() {
    const {scrollPos, width} = this.state,
          imageCount = this.props.images.length;

    return constrain(Math.ceil(-scrollPos / width), 0, imageCount - 1);
  },

  _animateToPane(pane, duration, easing) {
    Animations.animate({
      name: 'horizontalPan-' + this.props.slug,
      start: this.state.scrollPos,
      end: -this.state.width * pane,
      duration: duration,
      easing: easing,
      onUpdate: (pos) => {
        this.setState({ scrollPos: pos });
      }
    });
  },

  _handleDrag(evt) {
    const {deltaX, direction, preventDefault} = evt,
          {isDragging, isDraggingHorizontally, scrollPos, scrollPosAtDragStart, width} = this.state,
          {dragConstant, images} = this.props,
          imageCount = images.length;

    if (isDragging && isDraggingHorizontally) {
      preventDefault();
      let dragOffset = deltaX;
      if (scrollPosAtDragStart + deltaX > 0 ||
          scrollPosAtDragStart + deltaX < -width * (imageCount - 1)) {
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
          {isDraggingHorizontally, scrollPos, width} = this.state,
          {images, returnThreshold} = this.props,
          imageCount = images.length,
          currentPane = this._getCurrentPane();
    let destinationPane = currentPane, distanceToScroll, duration;

    if (isDraggingHorizontally) {
      if (scrollPos > 0 || imageCount === 1) {
        // scrollPosed out of bounds at start
        this._animateToPane(currentPane, 600, Easings.elasticOut);
      } else if (scrollPos < -width * (imageCount - 1)) {
        // scrollPosed out of bounds at end
        if (Math.abs(deltaX) > width * returnThreshold && imageCount > 1) {
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
        distanceToScroll = Math.abs(-width * destinationPane - scrollPos);
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

    if (nextPane === 0) {
      this._animateToPane(0, 150 * imageCount, Easings.returnHome);
    } else {
      this._animateToPane(nextPane, 350, Easings.cubicInOut);
    }
  },

  render() {
    const {description, dragConstant, returnThreshold, images, title} = this.props,
          {height, scrollPos, width} = this.state,
          imageCount = images.length;

    let listStyle, draggedPastEnd, indicatorProgress, indicatorFinalPosition, indicatorStyle;

    listStyle = {
      width: width * imageCount,
      transform: "translate3d(" + scrollPos + "px, 0, 0)"
    };

    if (imageCount > 1 && -scrollPos > width * (imageCount - 1)) {
      indicatorFinalPosition = dragConstant * width * returnThreshold * 0.8;

      draggedPastEnd = (-scrollPos/width - (imageCount - 1))/dragConstant;

      indicatorProgress = Easings.sineIn(constrain(draggedPastEnd/returnThreshold, 0, 1));

      indicatorStyle = {
        opacity: indicatorProgress,
        transform: "translate3d(-" + indicatorProgress * indicatorFinalPosition + "px, 0, 0)"
      };
    }

    return (
      <div className="carousel">
        <div className="carousel__wrapper" ref="wrapper">
          <TouchHandler
            onDrag={this._handleDrag}
            onDragRelease={this._handleDragRelease}
            onTap={this._advanceToNextPane}>
            <div
              onClick={this._advanceToNextPane}
              className="carousel__frame"
              style={{ width }}>
              <ul className="carousel__list" style={listStyle}>
                {images.map((image, index) => (
                  <li key={index} className="carousel__item" style={{ width, height }}>
                    <img className="carousel__image" src={image} />
                  </li>
                ))}
              </ul>
            </div>
          </TouchHandler>
          {imageCount > 1 ? (
            <i className="carousel__return-indicator fa fa-arrow-left" style={indicatorStyle} />
          ) : null}
        </div>
        <div className="push-top-xs clearfix">
          <h4 className="pull-left">{title}</h4>
          <div className="carousel-counter pull-right" onClick={this._advanceToNextPane}>
            {this._getCurrentPane() + 1} of {imageCount}
          </div>
        </div>
        <div>{description}</div>
      </div>
    );
  }
});

const constrain = (value, min, max) => Math.min(Math.max(value, min), max);
