import React from 'react';
import classNames from 'classnames';
import HammerComponent from 'components/common/Hammer.jsx';
import Animations from 'utils/animations.jsx';
import Easings from 'utils/easings.jsx';

export default React.createClass({
  propTypes: {
    description: React.PropTypes.string.isRequired,
    dragConstant: React.PropTypes.number,     // how much scrolling slows down when dragging past bounds
    images: React.PropTypes.array.isRequired,
    returnThreshold: React.PropTypes.number.isRequired, // how much dragging past end is needed to return to first image
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
      isDragging: false,
      isDraggingHorizontally: false,
      scroll: 0,
      scrollAtDragStart: null,
      width: 100
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
    const {scroll, width} = this.state,
          imageCount = this.props.images.length;

    return constrain(Math.floor(-scroll / width + 0.5), 0, imageCount - 1);
  },

  _getPrevPane() {
    const {scroll, width} = this.state,
          imageCount = this.props.images.length;

    return constrain(Math.floor(-scroll / width), 0, imageCount - 1);
  },

  _getNextPane() {
    const {scroll, width} = this.state,
          imageCount = this.props.images.length;

    return constrain(Math.ceil(-scroll / width), 0, imageCount - 1);
  },

  _animateToPane(pane, duration, easing) {
    Animations.animate(
      'horizontalPan',
      this.state.scroll,
      -this.state.width * pane,
      duration,
      easing,
      (pos) => {
        this.setState({ scroll: pos });
      }
    )
  },

  _handlePan(evt) {
    const {deltaX, direction, eventType, preventDefault} = evt,
          {isDragging, isDraggingHorizontally, scroll, scrollAtDragStart, width} = this.state,
          {dragConstant, images} = this.props,
          imageCount = images.length;

    if (eventType === EVENT_TYPES['release']) {
      this._handleDragRelease(evt);
    }

    if (isDragging && isDraggingHorizontally) {
      preventDefault();
      let dragOffset = deltaX;
      if (scrollAtDragStart + deltaX > 0 ||
          scrollAtDragStart + deltaX < -width * (imageCount - 1)) {
        dragOffset *= dragConstant;
      };

      this.setState({
        scroll: scrollAtDragStart + dragOffset
      });
    }

    if (!isDragging) {
      Animations.stop('horizontalPan');

      this.setState({
        isDragging: true,
        isDraggingHorizontally: direction === DIRECTIONS['left'] || direction === DIRECTIONS['right'],
        scrollAtDragStart: scroll
      });
    }
  },

  _handleDragRelease(evt) {
    const {deltaX, velocityX} = evt,
          {isDraggingHorizontally, scroll, width} = this.state,
          {images, returnThreshold} = this.props,
          imageCount = images.length,
          currentPane = this._getCurrentPane();
    let destinationPane = currentPane, distanceToScroll, duration;

    if (isDraggingHorizontally) {
      if (scroll > 0) {
        // scrolled out of bounds at start
        this._animateToPane(currentPane, 600, Easings.elasticOut);
      } else if (scroll < -width * (imageCount - 1)) {
        // scrolled out of bounds at end
        if (Math.abs(deltaX) > width * returnThreshold) {
          this._animateToPane(0, 120 * imageCount, Easings.elasticOut);
        } else {
          this._animateToPane(currentPane, 600, Easings.elasticOut);
        }
      } else {
        if (Math.abs(velocityX) > 0.05) {
          if (velocityX > 0) {
            destinationPane = this._getNextPane();
          }
          if (velocityX < 0 && deltaX > 0) {
            destinationPane = this._getPrevPane();
          }
        }
        destinationPane = constrain(destinationPane, 0, imageCount - 1);
        distanceToScroll = Math.abs(-width * destinationPane - scroll);
        duration = constrain(Math.abs(distanceToScroll/velocityX), 250, 400);

        this._animateToPane(destinationPane, duration, Easings.cubicOut);
      }
    }

    this.setState({
      isDragging: false,
      isDraggingHorizontally: false,
      scrollAtDragStart: null
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
          {width, scroll} = this.state,
          imageCount = images.length;

    let listStyle, draggedPastEnd, indicatorProgress, indicatorFinalPosition, indicatorStyle;

    listStyle = {
      width: width * imageCount,
      transform: "translate3d(" + scroll + "px, 0, 0)"
    };

    draggedPastEnd = (-scroll/width - (imageCount - 1))/dragConstant;

    indicatorProgress = Easings.sineIn(constrain(draggedPastEnd/returnThreshold, 0, 1));
    indicatorFinalPosition = dragConstant * width * returnThreshold * 0.8;

    indicatorStyle = {
      opacity: indicatorProgress,
      transform: "translate3d(-" + indicatorProgress * indicatorFinalPosition + "px, 0, 0)"
    };

    return (
      <div className="carousel">
        <div className="carousel__wrapper" ref="wrapper">
          <HammerComponent
            vertical
            onPan={this._handlePan}
            onTap={this._advanceToNextPane}
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
          <i className="carousel__return-indicator fa fa-arrow-left" style={indicatorStyle} />
        </div>
        <div className="carousel__info clearfix">
          <h4 className="carousel__info__title pull-left">{title}</h4>
          <div className="carousel__info__counter pull-right" onClick={this._advanceToNextPane}>
            {this._getCurrentPane() + 1} of {imageCount}
          </div>
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
