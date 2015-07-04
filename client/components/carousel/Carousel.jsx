import React from 'react';
import classNames from 'classnames';
import HammerComponent from 'react-hammerjs';

export default React.createClass({
  propTypes: {
    images: React.PropTypes.array.isRequired,
    padding: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      padding: 8
    };
  },

  getInitialState() {
    return {
      dragDistance: 0,
      isDragging: false,
      isDraggingHorizontal: false,
      pane: 0,
      width: 0
    };
  },

  componentDidMount() {
    this._setDimensions();

    window.addEventListener('resize', this._setDimensions);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._setDimensions);
  },

  _setDimensions() {
    const elem = React.findDOMNode(this);

    this.setState({
      width: elem.offsetWidth
    })
  },

  _setPane(pane) {
    const imageCount = this.props.images.length;

    this.setState({
      dragDistance: 0,
      isDragging: false,
      pane: Math.max(0, Math.min(imageCount - 1, pane))
    });
  },

  _nextPane() {
    this._setPane(this.state.pane + 1);
  },

  _prevPane() {
    this._setPane(this.state.pane - 1);
  },

  _handlePan(evt) {
    const {eventType, deltaX, direction, preventDefault} = evt;
    const {isDragging, isDraggingHorizontal} = this.state;

    if (eventType === EVENT_TYPES['release']) {
      this._handleRelease(evt);
    } else if (isDragging) {
      if (isDraggingHorizontal) {
        preventDefault();
        this.setState({
          dragDistance: deltaX,
          isDragging: true
        });
      }
    } else {
      this.setState({
        isDragging: true,
        isDraggingHorizontal: direction === DIRECTIONS['left'] || direction === DIRECTIONS['right']
      });
    }
  },

  _handleRelease(evt) {
    const {deltaX, velocityX} = evt;
    const {width, pane} = this.state;

    if (Math.abs(deltaX) > width * 0.3) {
      if (deltaX < 0) {
        this._nextPane();
      } else {
        this._prevPane();
      }
    } else if (Math.abs(velocityX) > 0.1) {
      if (velocityX > 0) {
        this._nextPane();
      } else {
        this._prevPane();
      }
    } else {
      this._setPane(pane);
    }
  },

  render() {
    const {images, padding} = this.props;
    const {width, pane, dragDistance, isDragging} = this.state;
    const imageCount = images.length;
    const paneOffset = -100 * pane / imageCount;
    let dragOffset = 100 * dragDistance / width / imageCount;
    if (pane === 0 && dragDistance > 0 || pane === imageCount - 1 && dragDistance < 0) {
      dragOffset *= 0.2;
    }
    const containerStyle = {
      width: (width + padding) * imageCount,
      transform: "translate3d(" + (paneOffset + dragOffset) + "%, 0, 0) scale3d(1, 1, 1)"
    };
    const carouselListClasses = classNames({
      "carousel__list": true,
      "animate": !isDragging
    });

    return (
      <div>
        <HammerComponent
          vertical
          onPan={this._handlePan}
          options={{
            recognizers: {
              swipe: {
                velocity: 0.1
              }
            }
          }}>
          <div className="carousel" style={{ width: width }}>
            <ul className={carouselListClasses} style={containerStyle}>
              {images.map((image, index) => (
                <li key={index} className="carousel__item" style={{ width: width + padding, paddingRight: padding }}>
                  <img className="carousel__image" src={image} />
                </li>
              ))}
            </ul>
            <ul className="carousel__indicators">
              {images.map((image, index) => {
                const indicatorClasses = classNames({
                  "carousel__indicator": true,
                  "is-active": index === pane
                });
                return <li key={index} className={indicatorClasses}>&bull;</li>;
              })}
            </ul>
          </div>
        </HammerComponent>
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
