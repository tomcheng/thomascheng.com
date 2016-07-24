import React, { Component } from "react";

class TouchHandler extends Component {
  static propTypes = {
    children: React.PropTypes.element.isRequired,
    stopPropagation: React.PropTypes.bool,
    onDrag: React.PropTypes.func,
    onDragRelease: React.PropTypes.func,
    onTap: React.PropTypes.func,
  };

  constructor (props) {
    super(props);

    this.state = {
      start: null,
      last: null,
      hasDragged: false,
      isTouched: false,
    };
  }

  getCurrentTime = () => new Date().getTime();

  handleTouchStart = evt => {
    const x = evt.touches[0].clientX;
    const y = evt.touches[0].clientY;
    const time = this.getCurrentTime();

    if (this.props.stopPropagation) evt.stopPropagation();

    this.setState({
      start: {x, y, time},
      last: {x, y, time},
      isTouched: true,
    });

    if (this.cancelIsTouched) {
      clearTimeout(this.cancelIsTouched);
    }

    this.cancelIsTouched = setTimeout(() => { this.setState({ isTouched: false }); }, 1000);
  };

  handleTouchMove = evt => {
    const x = evt.touches[0].clientX;
    const y = evt.touches[0].clientY;
    const time = this.getCurrentTime();
    const { start, last, hasDragged } = this.state;
    const deltaX = x - start.x;
    const deltaY = y - start.y;
    const velocityX = (x - last.x) / (time - last.time);
    const velocityY = (y - last.y) / (time - last.time);

    let direction;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? "right" : "left";
    } else {
      direction = deltaY > 0 ? "down" : "up";
    }

    this.props.onDrag({
      deltaX, deltaY, velocityX, velocityY, direction, x, y,
      preventDefault: evt.preventDefault,
    });

    if (!hasDragged) {
      if (Math.abs(deltaX) >= 2 || Math.abs(deltaY) >= 2) {
        this.setState({ hasDragged: true });
      }
    }

    this.setState({ last: {x, y, velocityX, velocityY, time} });
  };

  handleTouchEnd = evt => {
    const { last, start, hasDragged } = this.state;
    const { velocityX, velocityY } = last;
    const deltaX = last.x - start.x;
    const deltaY = last.y - start.y;

    if (hasDragged) {
      this.props.onDragRelease({deltaX, deltaY, velocityX, velocityY});
    } else {
      this.props.onTap();
    }

    this.setState({
      start: null,
      last: null,
      hasDragged: false,
    });
  };

  handleClick = evt => {
    if (this.props.stopPropagation) { evt.stopPropagation(); }
    if (!this.state.isTouched) { this.props.onTap(); }
  };

  render () {
    return (
      <div
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        onClick={this.handleClick}>
        {this.props.children}
      </div>
    );
  }
}

TouchHandler.defaultProps = {
  onDrag: () => {},
  onDragRelease: () => {},
  onTap: () => {},
  stopPropagation: false,
};

export default TouchHandler;
