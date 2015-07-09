import React from 'react';
import classNames from 'classnames';
import HammerComponent from 'components/common/Hammer.jsx';
import Animations from 'utils/animations.jsx';

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
      pane: 0,
      scrollPosition: 0,
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
    const elem = React.findDOMNode(this.refs.wrapper);

    this.setState({
      width: elem.offsetWidth
    })
  },

  _getNextPane() {
    return this.nextPane;
  },

  _isDraggingHorizontally() {
    const {dragDirection} = this.state;

    return (dragDirection === DIRECTIONS['left'] || dragDirection === DIRECTIONS['right']);
  },

  _constrain(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  _handlePan(evt) {
    const {deltaX, direction, eventType, preventDefault} = evt;
    const {isDragging} = this.state;

    if (isDragging) {
      if (this._isDraggingHorizontally()) {
        preventDefault();
        this.setState({
          scrollPosition: -(this.state.pane * this.state.width) + deltaX
        });
      }
    } else {
      this.setState({
        dragDirection: direction,
        isDragging: true
      });
    }

    if (eventType === EVENT_TYPES['release']) {
      this._handleDragRelease(evt);
    }
  },

  _handleDragRelease(evt) {
    const {deltaX, velocityX} = evt;
    const {width, pane} = this.state;
    let nextPane = pane;

    if (this._isDraggingHorizontally()) {
      if (Math.abs(velocityX) > 0.05) {
        if (velocityX > 0 && deltaX < 0) nextPane++;
        if (velocityX < 0 && deltaX > 0) nextPane--;
      } else if (Math.abs(deltaX) > width * 0.3) {
        if (deltaX < 0) {
          nextPane++;
        } else {
          nextPane--;
        }
      }
    }

    nextPane = this._constrain(nextPane, 0, this.props.images.length - 1);

    this.setState({
      isDragging: false,
      pane: nextPane
    });

    this._animateToPane(nextPane, Math.abs(velocityX));
  },

  _atLastPane() {
    return this.state.pane === this.props.images.length - 1;
  },

  _animateToPane(pane, velocity) {
    const distanceToScroll = Math.abs(-this.state.width * pane - this.state.scrollPosition);
    const duration = this._constrain(distanceToScroll/velocity, 250, 400);
    Animations.animate(
      'test',
      this.state.scrollPosition,
      -this.state.width * pane,
      duration,
      velocity,
      (pos) => {
        this.setState({
          scrollPosition: pos
        });
      }
    )
  },

  _handleTap(evt) {
    const nextPane = this._atLastPane() ? 0 : this.state.pane + 1;

    this.setState({ pane: nextPane });
    this._animateToPane(nextPane, 0);
  },

  render() {
    const {description, images, title} = this.props;
    const {width, pane, isDragging, scrollPosition} = this.state;
    const imageCount = images.length;

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
          <div className="carousel__info__counter pull-right">{pane + 1} of {imageCount}</div>
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
