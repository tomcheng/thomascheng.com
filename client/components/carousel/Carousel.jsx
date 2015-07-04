import React from 'react';
import classNames from 'classnames';
import HammerComponent from 'react-hammerjs';

export default React.createClass({
  propTypes: {
    images: React.PropTypes.array.isRequired
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

  _handleSwipe(e) {
    const {pane} = this.state;

    this.setState({ swipeActived: true });

    switch(e.direction) {
      case 2: // left
        this._setPane(pane + 1)
        break;
      case 4: // right
        this._setPane(pane - 1)
        break;
    }
  },

  _handlePan(evt) {
    const {isDragging, isDraggingHorizontal, swipeActived} = this.state;
    const {eventType, deltaX, direction} = evt;

    if (eventType === 4) { // release
      if (swipeActived) {
        this.setState({
          swipeActived: false,
          dragDistance: 0,
          isDragging: false
        });
      } else {
        if (Math.abs(deltaX) > this.state.width / 2) {
          if (deltaX < 0) {
            this._setPane(this.state.pane + 1);
          } else {
            this._setPane(this.state.pane - 1);
          }
        }
        this.setState({
          dragDistance: 0,
          isDragging: false
        });
      }
      return;
    }

    if (isDragging && isDraggingHorizontal) {
      evt.preventDefault();
      this.setState({
        dragDistance: deltaX,
        isDragging: true
      });
      return;
    }

    if (!isDragging) {
      if (direction === 8 || direction === 16) {
        this.setState({
          isDragging: true,
          isDraggingHorizontal: false
        })
      } else {
        this.setState({
          isDragging: true,
          isDraggingHorizontal: true
        });
      }
    }

  },

  render() {
    const {images} = this.props;
    const {width, pane, dragDistance, isDragging} = this.state;
    const imageCount = images.length;
    const paneOffset = -100 * pane / imageCount;
    let dragOffset = 100 * dragDistance / width / imageCount;
    if (pane === 0 && dragDistance > 0 || pane === imageCount - 1 && dragDistance < 0) {
      dragOffset *= 0.4;
    }
    const containerStyle = {
      width: width * imageCount,
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
                threshold: 0.3
              }
            }
          }}>
          <div className="carousel" style={{ width: width }}>
            <ul className={carouselListClasses} style={containerStyle}>
              {images.map((image, index) => (
                <li key={index} className="carousel__item" style={{ width: width }}>
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
