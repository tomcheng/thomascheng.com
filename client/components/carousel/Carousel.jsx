import React from 'react';
import classNames from 'classnames';
import HammerComponent from 'components/common/Hammer.jsx';
import Animations from 'utils/animations.jsx';
import Easings from 'utils/easings.jsx';

export default React.createClass({
  propTypes: {
    description: React.PropTypes.string.isRequired,
    images: React.PropTypes.array.isRequired,
    title: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      dragDirection: null,
      isDragging: false,
      isDraggingHorizontally: false,
      scrollPosition: 0,
      scrollPositionAtDragStart: null,
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
    this.setState({ width: React.findDOMNode(this.refs.wrapper).offsetWidth });
  },

  _getCurrentPane() {
    const {scrollPosition, width} = this.state,
          imageCount = this.props.images.length;

    return constrain(Math.floor(-scrollPosition / width + 0.5), 0, imageCount - 1);
  },

  _getPrevPane() {
    const {scrollPosition, width} = this.state,
          imageCount = this.props.images.length;

    return constrain(Math.floor(-scrollPosition / width), 0, imageCount - 1);
  },

  _getNextPane() {
    const {scrollPosition, width} = this.state,
          imageCount = this.props.images.length;

    return constrain(Math.ceil(-scrollPosition / width), 0, imageCount - 1);
  },

  _isScrolledOutOfBounds() {
    const {scrollPosition, width} = this.state,
          imageCount = this.props.images.length;

    return scrollPosition > 0 || scrollPosition < -width * (imageCount - 1);
  },

  _animateToPane(pane, duration, easing) {
    Animations.animate(
      'horizontalPan',
      this.state.scrollPosition,
      -this.state.width * pane,
      duration,
      easing,
      (pos) => {
        this.setState({ scrollPosition: pos });
      }
    )
  },

  _handlePan(evt) {
    const {deltaX, direction, eventType, preventDefault} = evt,
          {isDragging, isDraggingHorizontally, scrollPosition, scrollPositionAtDragStart, width} = this.state,
          imageCount = this.props.images.length;

    if (eventType === EVENT_TYPES['release']) {
      this._handleDragRelease(evt);
    }

    if (isDragging && isDraggingHorizontally) {
      preventDefault();
      let dragOffset = deltaX;
      if (scrollPositionAtDragStart + deltaX > 0 ||
          scrollPositionAtDragStart + deltaX < -width * (imageCount - 1)) {
        dragOffset *= 0.15;
      };

      this.setState({
        scrollPosition: scrollPositionAtDragStart + dragOffset
      });
    }

    if (!isDragging) {
      Animations.stop('horizontalPan');

      this.setState({
        isDragging: true,
        isDraggingHorizontally: direction === DIRECTIONS['left'] || direction === DIRECTIONS['right'],
        scrollPositionAtDragStart: scrollPosition
      });
    }
  },

  _handleDragRelease(evt) {
    const {deltaX, velocityX} = evt,
          {isDraggingHorizontally, scrollPosition, width} = this.state,
          currentPane = this._getCurrentPane();
    let destinationPane = currentPane, distanceToScroll, duration;

    if (isDraggingHorizontally) {
      if (this._isScrolledOutOfBounds()) {
        this._animateToPane(currentPane, 600, Easings.elasticOut);
      } else {
        if (Math.abs(velocityX) > 0.05) {
          if (velocityX > 0) {
            destinationPane = this._getNextPane();
          }
          if (velocityX < 0 && deltaX > 0) {
            destinationPane = this._getPrevPane();
          }
        }
        destinationPane = constrain(destinationPane, 0, this.props.images.length - 1);
        distanceToScroll = Math.abs(-width * destinationPane - scrollPosition);
        duration = constrain(Math.abs(distanceToScroll/velocityX), 250, 400);

        this._animateToPane(destinationPane, duration, Easings.cubicOut);
      }
    }

    this.setState({
      isDragging: false,
      isDraggingHorizontally: false,
      scrollPositionAtDragStart: null
    });

  },

  _handleTap(evt) {
    const imageCount = this.props.images.length,
          currentPane = this._getCurrentPane(),
          nextPane = currentPane === imageCount - 1 ? 0 : currentPane + 1;

    if (nextPane === 0) {
      this._animateToPane(nextPane, 150 * this.props.images.length, Easings.returnHome);
    } else {
      this._animateToPane(nextPane, 350, Easings.cubicInOut);
    }
  },

  render() {
    const {description, images, title} = this.props,
          {width, scrollPosition} = this.state,
          imageCount = images.length;

    const listStyle = {
      width: width * imageCount,
      transform: "translate3d(" + scrollPosition + "px, 0, 0)"
    };

    return (
      <div className="carousel">
        <div className="carousel__wrapper" ref="wrapper">
          <HammerComponent
            vertical
            onPan={this._handlePan}
            onTap={this._handleTap}
            options={{recognizers:{tap:{time:500, threshold:2}}}}>
            <div className="carousel__frame" style={{ width: width }}>
              <ul className="carousel__list" style={listStyle}>
                {images.map((image, index) => (
                  <li key={index} className="carousel__item" style={{ width: width }}>
                    <img className="carousel__image" src={image} />
                  </li>
                ))}
              </ul>
            </div>
          </HammerComponent>
        </div>
        <div className="carousel__info clearfix">
          <h4 className="carousel__info__title pull-left">{title}</h4>
          <div className="carousel__info__counter pull-right">{this._getCurrentPane() + 1} of {imageCount}</div>
        </div>
        <div className="carousel__description">{description}</div>
      </div>
    );
  }
});

const DIRECTIONS = {
  left: 2,
  right: 4,
  up: 8,
  down: 16
};

const EVENT_TYPES = {
  release: 4
};

const constrain = (value, min, max) => Math.min(Math.max(value, min), max);
