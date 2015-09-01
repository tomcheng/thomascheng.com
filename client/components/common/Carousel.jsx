import React from 'react';
import classNames from 'classnames';
import Animations from 'utils/animations.jsx';
import Easings from 'utils/easings.jsx';
import TouchHandler from 'components/common/TouchHandler.jsx';

export default React.createClass({
  propTypes: {
    description: React.PropTypes.string,
    dragConstant: React.PropTypes.number,     // how much scrollPosing slows down when dragging past bounds
    images: React.PropTypes.array.isRequired,
    returnThreshold: React.PropTypes.number,  // how much dragging past end is needed to return to first image
    slug: React.PropTypes.string.isRequired,
    title: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      description: null,
      dragConstant: 0.2,
      returnThreshold: 0.6,
      title: ""
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
      shouldWiggle: false,
      width: 1000
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
    const newWidth = React.findDOMNode(this.refs.wrapper).offsetWidth,
          currentPane = this._getCurrentPane();
    this.setState({
      width: Math.max(newWidth, 1),
      scrollPos: -newWidth * currentPane
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
        {description ? (
          <div>
            <h4>{title}</h4>
            <div className="clearfix">
              <div className="push-bottom-xs pull-left">
                {description}
              </div>
              <div className="push-bottom-xs pull-right">
                {imageCount > 1 ? (
                  <div className="carousel__header__counter" onClick={this._advanceToNextPane}>
                    {this._getCurrentPane() + 1}&nbsp;of&nbsp;{imageCount}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="clearfix">
            <div className="push-bottom-xs pull-left">
              <h4>{title}</h4>
            </div>
            <div className="push-bottom-xs pull-right">
              {imageCount > 1 ? (
                <div className="carousel__header__counter" onClick={this._advanceToNextPane}>
                  {this._getCurrentPane() + 1}&nbsp;of&nbsp;{imageCount}
                </div>
              ) : null}
            </div>
          </div>
        )}
        <div className="carousel__wrapper" ref="wrapper">
          <TouchHandler
            onDrag={this._handleDrag}
            onDragRelease={this._handleDragRelease}
            onTap={this._advanceToNextPane}>
            <div
              className={classNames("carousel__frame", {
                "wiggle": this.state.shouldWiggle
              })}
              style={{ width }}>
              <ul className="carousel__list" style={listStyle}>
                {images.map((image, index) => (
                  <li key={index} className="carousel__item" style={{ width }}>
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
      </div>
    );
  }
});

const constrain = (value, min, max) => Math.min(Math.max(value, min), max);
