import React from "react";
import classNames from "classnames";

import Animations from 'utils/animations.jsx';
import Easings from 'utils/easings.jsx';

import TouchHandler from "components/common/TouchHandler.jsx";

export default React.createClass({
  propTypes: {
    animateToClose: React.PropTypes.func.isRequired,
    animateToOpen: React.PropTypes.func.isRequired,
    menuState: React.PropTypes.bool,
    navigationWidth: React.PropTypes.number.isRequired,
    position: React.PropTypes.number.isRequired,
    setMenuState: React.PropTypes.func.isRequired,
    setPosition: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      isDragging: false,
      isDraggingHorizontally: false,
      posAtDragStart: 0
    };
  },

  _handleDrag(evt) {
    const {deltaX, direction, preventDefault} = evt,
          {position, setPosition, navigationWidth} = this.props,
          {isDragging, isDraggingHorizontally, posAtDragStart} = this.state;

    Animations.stop('navigation');

    if (isDragging) {
      if (isDraggingHorizontally) {
        preventDefault();
        setPosition(constrain(deltaX + posAtDragStart, 0, navigationWidth));
      }
    } else {
      this.setState({
        isDragging: true,
        isDraggingHorizontally: direction === "left" || direction === "right",
        posAtDragStart: position
      })
    }
  },

  _handleDragRelease(evt) {
    const {velocityX, deltaX} = evt,
          {animateToClose, animateToOpen, navigationWidth, position} = this.props;

    if (Math.abs(velocityX) > 0.05) {
      if (velocityX < 0) {
        const duration = constrain(Math.abs(position / velocityX), 250, 400);
        animateToClose(duration, Easings.cubicOut);
      } else {
        const duration = constrain(Math.abs((position - navigationWidth) / velocityX), 250, 400);
        animateToOpen(duration, Easings.cubicOut);
      }
    } else {
      if (position > navigationWidth / 2) {
        animateToOpen(350, Easings.cubicInOut);
      } else {
        animateToClose(350, Easings.cubicInOut);
      }
    }

    this.setState({ isDragging: false });
  },

  _handleTap() {
    const {animateToClose, animateToOpen, menuState} = this.props;

    if (menuState) {
      animateToClose(350, Easings.cubicInOut);
    } else {
      animateToOpen(350, Easings.cubicInOut);
    }
  },

  render() {
    const handleClassNames = classNames("header__navigation-handle navigation-handle", {
      "navigation-handle--inflated": this.props.menuState
    });

    return (
      <TouchHandler
        onDrag={this._handleDrag}
        onDragRelease={this._handleDragRelease}
        onTap={this._handleTap}>
        <div onClick={this._handleTap} className={handleClassNames} />
      </TouchHandler>
    );
  }
});

const constrain = (value, min, max) => Math.min(Math.max(value, min), max);
