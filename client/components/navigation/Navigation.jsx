import React from "react";
import classNames from "classnames";
import {Link} from "react-router";

import Animations from 'utils/animations.jsx';
import Easings from 'utils/easings.jsx';
import TouchHandler from "components/common/TouchHandler.jsx";

export default React.createClass({
  propTypes: {
    headerComponent: React.PropTypes.element.isRequired,
    bodyComponent: React.PropTypes.element.isRequired
  },

  getDefaultProps() {
    return { navigationWidth: 200 };
  },

  getInitialState() {
    return {
      isDragging: false,
      isDraggingHorizontally: false,
      menuVerticalPos: 0,
      menuHorizontalPos: 0,
      posAtDragStart: 0,
      showMenu: false
    };
  },

  componentWillUpdate(nextProps, nextState) {
    this._toggleBodyScroll(!nextState.showMenu);
  },

  _handleNavHandleClick() {
    this.setState({
      menuVerticalPos: document.getElementsByTagName('body')[0].scrollTop,
      showMenu: !this.state.showMenu
    });
  },

  _handleTap() {
    if (this.state.showMenu) {
      this._animateToClose(350, Easings.cubicInOut);
    } else {
      this._animateToOpen(350, Easings.cubicInOut);
    }
  },

  _toggleBodyScroll(shouldScroll) {
    document.getElementsByTagName("body")[0].style.overflow = shouldScroll ? null : "hidden";
  },

  _handleDrag(evt) {
    const {deltaX, direction, preventDefault} = evt,
          {isDragging, isDraggingHorizontally, menuHorizontalPos, posAtDragStart} = this.state;

    Animations.stop('navigation');

    if (isDragging) {
      if (isDraggingHorizontally) {
        preventDefault();
        this.setState({
          menuHorizontalPos: Math.max(deltaX + posAtDragStart, 0)
        });
      }
    } else {
      this.setState({
        isDragging: true,
        isDraggingHorizontally: direction === "left" || direction === "right",
        posAtDragStart: menuHorizontalPos
      })
    }
  },

  _handleDragRelease(evt) {
    const {velocityX, deltaX} = evt,
          {menuHorizontalPos} = this.state,
          {navigationWidth} = this.props;

    if (Math.abs(velocityX) > 0.05) {
      if (velocityX < 0) {
        const duration = constrain(Math.abs(menuHorizontalPos / velocityX), 250, 400) ;
        this._animateToClose(duration, Easings.cubicOut);
      } else {
        const duration = constrain(Math.abs((menuHorizontalPos - navigationWidth) / velocityX), 250, 400);
        this._animateToOpen(duration, Easings.cubicOut);
      }
    } else {
      if (menuHorizontalPos > navigationWidth / 2) {
        this._animateToOpen(350, Easings.cubicInOut);
      } else {
        this._animateToClose(350, Easings.cubicInOut);
      }
    }
    this.setState({
      isDragging: false
    })
  },

  _animateToClose(duration, easing) {
    this.setState({ showMenu: false });

    Animations.animate({
      name: 'navigation',
      start: this.state.menuHorizontalPos,
      end: 0,
      duration: duration,
      easing: easing,
      onUpdate: (pos) => {
        this.setState({ menuHorizontalPos: pos });
      }
    });
  },

  _animateToOpen(duration, easing) {
    this.setState({ showMenu: true });

    Animations.animate({
      name: 'navigation',
      start: this.state.menuHorizontalPos,
      end: this.props.navigationWidth,
      duration: duration,
      easing: easing,
      onUpdate: (pos) => {
        this.setState({ menuHorizontalPos: pos });
      }
    });
  },

  _getNavHandle() {
    const handleClassNames = classNames("header__navigation-handle navigation-handle", {
      "navigation-handle--inflated": this.state.showMenu
    });
    return (
      <TouchHandler
        onDrag={this._handleDrag}
        onDragRelease={this._handleDragRelease}
        onTap={this._handleTap}>
        <div className={handleClassNames} />
      </TouchHandler>
    );
  },

  render() {
    const {bodyComponent, headerComponent, navigationWidth} = this.props,
          {isDragging, menuVerticalPos, menuHorizontalPos, showMenu} = this.state,
          containerStyles = {
            transform: "translate3d(" + menuHorizontalPos + "px, 0, 0)"
          },
          menuStyles = {
            top: menuVerticalPos
          };

    return (
      <div>
        {React.cloneElement(headerComponent, {
          menuShown: showMenu,
          navigationHandle: this._getNavHandle(),
          navigationOffset: menuHorizontalPos
        })}
        <div className="navigation">
          <div className="navigation__menu-container" style={menuStyles}>
            <ul className="navigation__menu">
              <li className="navigation__menu__item">
                <Link onClick={this._handleLinkClick} to="/">Home</Link>
              </li>
              <li className="navigation__menu__item">
                <Link onClick={this._handleLinkClick} to="/portfolio">Portfolio</Link>
              </li>
            </ul>
          </div>
          <div className="navigation__container" style={containerStyles}>
            <div className="navigation__content">
              {bodyComponent}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

const constrain = (value, min, max) => Math.min(Math.max(value, min), max);
