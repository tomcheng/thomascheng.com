import React from 'react';
import classNames from 'classnames';
import HammerComponent from 'react-hammerjs';

export default React.createClass({
  propTypes: {
    images: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      width: 0,
      pane: 0,
      dragOffset: 0,
      isDragging: false
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
    this.setState({
      pane: pane
    });
  },

  _handleSwipe(event) {
    const {pane} = this.state;

    switch(event.direction) {
      case 2: // left
        this._setPane(pane + 1)
        break;
      case 4: // right
        this._setPane(pane - 1)
        break;
    }
  },

  _handlePan(event) {
    if (event.eventType === 4) { // release
      this.setState({
        dragOffset: 0,
        isDragging: false
      });
    } else {
      this.setState({
        dragOffset: event.deltaX,
        isDragging: true
      });
    }
  },

  render() {
    const {images} = this.props;
    const {width, pane, dragOffset, isDragging} = this.state;
    const imageCount = images.length;
    const containerOffsetPercentage = -100 * pane / imageCount
                                      + 100 * dragOffset / width / imageCount;
    const containerStyle = {
      width: width * imageCount,
      transform: "translate3d(" + containerOffsetPercentage + "%, 0, 0) scale3d(1, 1, 1)"
    };
    const carouselListClasses = classNames({
      'carousel__list': true,
      'animate': !isDragging
    });

    return (
      <div>
        <HammerComponent onSwipe={this._handleSwipe} onPan={this._handlePan}>
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
