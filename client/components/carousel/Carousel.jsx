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

  _isScrolledOutOfBounds() {
    const {scrollPosition, width} = this.state;
    const {images} = this.props;

    return scrollPosition > 0 || scrollPosition < -width * (images.length - 1);
  },

  _constrain(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  _handlePan(evt) {
    const {deltaX, direction, eventType, preventDefault} = evt;
    const {isDragging, scrollPosition, width} = this.state;

    if (isDragging) {
      if (this._isDraggingHorizontally()) {
        preventDefault();
        let dragOffset = deltaX;
        if (scrollPosition + deltaX > 0 ||
            scrollPosition + deltaX < -width * (this.props.images.length - 1)) {
          dragOffset *= 0.15;
        };

        this.setState({
          scrollPosition: -(this.state.pane * this.state.width) + dragOffset
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
    const {pane, scrollPosition, width} = this.state;
    let nextPane = pane;

    if (this._isScrolledOutOfBounds()) {
      this._animateToPane(nextPane, 600, elasticOut);
    } else {
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
      const distanceToScroll = Math.abs(-width * nextPane - scrollPosition);
      const speed = Math.abs(velocityX);
      const duration = this._constrain(distanceToScroll/speed, 250, 400);

      this._animateToPane(nextPane, duration);
    }

    this.setState({
      isDragging: false,
      pane: nextPane
    });

  },

  _atLastPane() {
    return this.state.pane === this.props.images.length - 1;
  },

  _animateToPane(pane, duration, easing) {
    easing = easing || cubicOut;

    Animations.animate(
      'swipe',
      this.state.scrollPosition,
      -this.state.width * pane,
      duration,
      easing,
      (pos) => {
        this.setState({
          scrollPosition: pos
        });
      }
    )
  },

  _handleTap(evt) {
    const nextPane = this._atLastPane() ? 0 : this.state.pane + 1;

    this._animateToPane(nextPane, 350);
    this.setState({ pane: nextPane });
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

const simplifyEasing = complexFn => x => complexFn(x, x, 0, 1, 1);
const easeOutElastic = (x, t, b, c, d) => {
  var s=1.70158;
  var p=0;
  var a=c;
  if (t==0) return 0;
  if ((t/=d)==1) return b+c;
  if (!p) p=d*.3;
  if (a < Math.abs(c)) {
    a=c;
    var s=p/4;
  } else {
    var s = p/(2*Math.PI) * Math.asin (c/a);
  }
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + 0;
};
const easeOutBounce = (x, t, b, c, d) => {
  if ((t/=d) < (1/2.75)) {
    return c*(7.5625*t*t) + b;
  } else if (t < (2/2.75)) {
    return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
  } else if (t < (2.5/2.75)) {
    return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
  } else {
    return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
  }
};

const cubicOut = x => --x * x * x + 1;
const elasticOut = x => simplifyEasing(easeOutElastic)(x);
const bounceOut = x => simplifyEasing(easeOutBounce)(x);
