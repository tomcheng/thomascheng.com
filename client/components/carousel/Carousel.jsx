import React from 'react';
import classNames from 'classnames';
import HammerComponent from 'react-hammerjs';

export default React.createClass({
  propTypes: {
    images: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      dragDirection: null,
      dragDistance: 0,
      justDragged: false,
      justTapped: false,
      isDragging: false,
      pane: 0,
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

  _isDraggingHorizontally() {
    const {dragDirection} = this.state;

    return (dragDirection === DIRECTIONS['left'] || dragDirection === DIRECTIONS['right']);
  },

  _resetDrag() {
    this.setState({
      dragDirection: null,
      dragDistance: 0,
      isDragging: false,
      justDragged: true,
      justTapped: false
    });
  },

  _handlePan(evt) {
    const {deltaX, direction, eventType, preventDefault} = evt;
    const {isDragging} = this.state;

    if (isDragging) {
      if (this._isDraggingHorizontally()) {
        preventDefault();
        this.setState({
          dragDistance: deltaX
        });
      }
    } else {
      this.setState({
        dragDirection: direction,
        isDragging: true,
        justDragged: false,
        justTapped: false
      });
    }

    if (eventType === EVENT_TYPES['release']) {
      this._handleDragRelease(evt);
    }
  },

  _handleDragRelease(evt) {
    const {deltaX, velocityX} = evt;
    const {width} = this.state;

    if (this._isDraggingHorizontally()) {
      if (Math.abs(velocityX) > 0.05) {
        if (velocityX > 0 && deltaX < 0) this._nextPane();
        if (velocityX < 0 && deltaX > 0) this._prevPane();
      } else if (Math.abs(deltaX) > width * 0.3) {
        if (deltaX < 0) {
          this._nextPane();
        } else {
          this._prevPane();
        }
      }
    }

    this._resetDrag();
  },

  _handleTap(evt) {
    if (this.state.pane === this.props.images.length - 1) {
      this._setPane(0);
    } else {
      this._nextPane();
    }

    this.setState({
      justDragged: false,
      justTapped: true
    });
  },

  _getIndicators() {
    const {images} = this.props;
    const {pane} = this.state;

    if (images.length === 1) return null;

    return (
      <ul className="carousel__indicators">
        {images.map((image, index) => {
          const indicatorClasses = classNames({
            "carousel__indicator": true,
            "is-active": index === pane
          });
          return <li key={index} className={indicatorClasses}>&bull;</li>;
        })}
      </ul>
    );
  },

  render() {
    const {images} = this.props;
    const {width, pane, dragDistance, isDragging, justDragged, justTapped} = this.state;
    const imageCount = images.length;
    let offset = - pane * width;

    if (isDragging) {
      if (pane === 0 && dragDistance > 0 || pane === imageCount - 1 && dragDistance < 0) {
        offset += 0.2 * dragDistance;
      } else {
        offset += dragDistance;
      }
    }

    const containerStyle = {
      width: width * imageCount,
      transform: "translate3d(" + offset + "px, 0, 0)"
    };

    const carouselListClasses = classNames({
      "carousel__list": true,
      "animate--dragged": justDragged,
      "animate--tapped": justTapped
    });

    return (
      <div>
        <HammerComponent
          vertical
          onPan={this._handlePan}
          onTap={this._handleTap}
          options={{recognizers:{tap:{time:500, threshold:10}}}}>
          <div className="carousel" style={{ width: width }}>
            <ul className={carouselListClasses} style={containerStyle}>
              {images.map((image, index) => (
                <li key={index} className="carousel__item" style={{ width: width }}>
                  <img className="carousel__image" src={image} />
                </li>
              ))}
            </ul>
            {this._getIndicators()}
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
