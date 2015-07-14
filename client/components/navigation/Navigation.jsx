import React from "react";
import classNames from "classnames";
import {Link} from "react-router";

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
      menuPosition: 0,
      showMenu: false
    };
  },

  componentWillUpdate(nextProps, nextState) {
    this._toggleBodyScroll(!nextState.showMenu);
  },

  _handleNavHandleClick() {
    this.setState({
      menuPosition: document.getElementsByTagName('body')[0].scrollTop,
      showMenu: !this.state.showMenu
    });
  },

  _handleLinkClick() {
    this.setState({ showMenu: false });
  },

  _toggleBodyScroll(shouldScroll) {
    document.getElementsByTagName("body")[0].style.overflow = shouldScroll ? null : "hidden";
  },

  _getNavHandle() {
    const handleClassNames = classNames("header__navigation-handle navigation-handle", {
      "navigation-handle--inflated": this.state.showMenu
    });
    return <div onClick={this._handleNavHandleClick} className={handleClassNames} />;
  },

  render() {
    const {bodyComponent, headerComponent, navigationWidth} = this.props,
          {menuPosition, showMenu} = this.state,
          containerStyles = {
            transform: "translate3d(" + (showMenu ? navigationWidth : 0) + "px, 0, 0)"
          },
          menuStyles = {
            top: menuPosition
          };

    return (
      <div>
        {React.cloneElement(headerComponent, {
          menuShown: showMenu,
          navigationHandle: this._getNavHandle(),
          navigationWidth: navigationWidth
        })}
        <div className="navigation">
          <div className="navigation__container" style={containerStyles}>
            <div className="navigation__menu" style={menuStyles}>
              <ul>
                <li><Link onClick={this._handleLinkClick} to="/">Home</Link></li>
                <li><Link onClick={this._handleLinkClick} to="/portfolio">Portfolio</Link></li>
              </ul>
            </div>
            <div className="navigation__content">
              {bodyComponent}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
