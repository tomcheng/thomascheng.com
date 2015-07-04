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
      padding: 10
    };
  },

  getInitialState() {
    return {
      dragDistance: 0,
      isDragging: false,
      isDraggingHorizontal: false,
      pane: 0,
      swipeActived: false,
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
      pane: Math.max(0, Math.min(imageCount - 1, pane))
    });
  },

  _nextPane() {
    this._setPane(this.state.pane + 1);
  },

  _prevPane() {
    this._setPane(this.state.pane - 1);
  },

  _handleSwipe(evt) {
    const {direction} = evt;

    this.setState({ swipeActived: true });

    if (direction === DIRECTIONS['left']) {
      this._nextPane();
    } else if (direction === DIRECTIONS['right']) {
      this._prevPane();
    }
  },

  _handlePan(evt) {
    const {isDragging, isDraggingHorizontal, swipeActived} = this.state;
    const {eventType, deltaX, direction, preventDefault} = evt;

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
    const {deltaX} = evt;

    if (Math.abs(deltaX) > this.state.width * 0.3 && !swipeActived) {
      if (deltaX < 0) {
        this._nextPane();
      } else {
        this._prevPane();
      }
    }

    this.setState({
      dragDistance: 0,
      isDragging: false,
      swipeActived: false
    });
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
      'carousel__list': true,
      'animate': !isDragging
    });

    return (
      <div>
        <HammerComponent
          vertical
          onSwipe={this._handleSwipe}
          onPan={this._handlePan}
          options={{
            recognizers: {
              swipe: {
                velocity: 0.3
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
