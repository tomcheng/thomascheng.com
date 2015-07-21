import React from "react";
import {Link} from "react-router";

import Animations from 'utils/animations.jsx';
import Easings from 'utils/easings.jsx';
import NavigationHandle from "components/navigation/NavigationHandle.jsx";

export default React.createClass({
  propTypes: {
    bodyComponent: React.PropTypes.element.isRequired,
    headerComponent: React.PropTypes.element.isRequired,
    links: React.PropTypes.array.isRequired
  },

  getDefaultProps() {
    return { navigationWidth: 200 };
  },

  getInitialState() {
    return {
      contentMinHeight: null,
      isDragging: false,
      isDraggingHorizontally: false,
      menuPosition: 0,
      posAtDragStart: 0,
      showMenu: false
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

  componentWillUpdate(nextProps, nextState) {
    this._toggleBodyScroll(!nextState.showMenu);
  },

  _setDimensions() {
    this.setState({ contentMinHeight: window.innerHeight });
  },

  _handleLinkClick() {
    this.animateToClose(350, Easings.cubicInOut);
  },

  _toggleBodyScroll(shouldScroll) {
    document.getElementsByTagName("body")[0].style.overflow = shouldScroll ? null : "hidden";
  },

  animateToClose(duration, easing) {
    const {menuPosition} = this.state;

    this.setState({ showMenu: false });

    Animations.animate({
      name: 'navigation',
      start: menuPosition,
      end: 0,
      duration: duration,
      easing: easing,
      onUpdate: (pos) => {
        this.setState({ menuPosition: pos });
      }
    });
  },

  animateToOpen(duration, easing) {
    const {navigationWidth} = this.props,
          {menuPosition} = this.state;

    this.setState({ showMenu: true });

    Animations.animate({
      name: 'navigation',
      start: menuPosition,
      end: navigationWidth,
      duration: duration,
      easing: easing,
      onUpdate: (pos) => {
        this.setState({ menuPosition: pos });
      }
    });
  },

  setMenuState(menuState) {
    this.setState({ showMenu: menuState });
  },

  setPosition(pos) {
    this.setState({ menuPosition: pos });
  },

  render() {
    const {bodyComponent, headerComponent, links, navigationWidth} = this.props,
          {contentMinHeight, isDragging, menuPosition, showMenu} = this.state,
          containerStyles = {
            transform: "translate3d(" + menuPosition + "px, 0, 0)"
          },
          contentStyles = {
            minHeight: contentMinHeight + "px"
          };

    return (
      <div>
        {React.cloneElement(headerComponent, {
          menuShown: showMenu,
          navigationHandle: (
            <NavigationHandle
              animateToClose={this.animateToClose}
              animateToOpen={this.animateToOpen}
              menuState={showMenu}
              navigationWidth={navigationWidth}
              position={menuPosition}
              setMenuState={this.setMenuState}
              setPosition={this.setPosition} />
          ),
          navigationOffset: menuPosition
        })}
        <div className="navigation">
          <div className="navigation__menu-container">
            <ul className="navigation__menu">
              {links.map(link => (
                <li key={link.title} className="navigation__menu__item">
                  <Link onClick={this._handleLinkClick} to={link.path}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="navigation__container" style={containerStyles}>
            <div className="navigation__content" style={contentStyles}>
              <div className="container">
                {bodyComponent}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
