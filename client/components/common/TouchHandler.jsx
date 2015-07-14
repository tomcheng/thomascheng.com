import React from 'react';

export default React.createClass({
  propTypes: {
    onDrag: React.PropTypes.func,
    onDragRelease: React.PropTypes.func,
    onTap: React.PropTypes.func
  },

  getInitialState() {
    return {
      start: null,
      last: null,
      hasDragged: false
    };
  },

  _getCurrentTime() {
    return new Date().getTime();
  },

  _handleTouchStart(evt) {
    const x = evt.touches[0].clientX,
          y = evt.touches[0].clientY,
          time = this._getCurrentTime();

    this.setState({
      start: {x, y, time},
      last: {x, y, time}
    });
  },

  _handleTouchMove(evt) {
    const x = evt.touches[0].clientX,
          y = evt.touches[0].clientY,
          time = this._getCurrentTime(),
          {start, last, hasDragged} = this.state,
          deltaX = x - start.x,
          deltaY = y - start.y,
          velocityX = (x - last.x) / (time - last.time),
          velocityY = (y - last.y) / (time - last.time);

    let direction;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    };

    this.props.onDrag({
      deltaX, deltaY, velocityX, velocityY, direction,
      preventDefault: () => evt.preventDefault()
    });

    if (!hasDragged) {
      if (Math.abs(deltaX) >= 2 || Math.abs(deltaY) >= 2) {
        this.setState({ hasDragged: true });
      }
    }

    this.setState({ last: {x, y, velocityX, velocityY, time} });
  },

  _handleTouchEnd(evt) {
    evt.preventDefault();
    const {last, start, hasDragged} = this.state,
          {velocityX, velocityY} = last,
          deltaX = last.x - start.x,
          deltaY = last.y - start.y

    if (hasDragged) {
      this.props.onDragRelease({deltaX, deltaY, velocityX, velocityY});
    } else {
      this.props.onTap();
    }

    this.setState({
      start: null,
      last: null,
      hasDragged: false
    });
  },

  render() {
    return (
      <div
        onTouchStart={this._handleTouchStart}
        onTouchMove={this._handleTouchMove}
        onTouchEnd={this._handleTouchEnd}>
        {this.props.children}
      </div>
    );
  }
});
