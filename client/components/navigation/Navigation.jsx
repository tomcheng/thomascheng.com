import React from 'react';
import classNames from 'classnames';

export default React.createClass({
  propTypes: {
    headerComponent: React.PropTypes.element.isRequired,
    bodyComponent: React.PropTypes.element.isRequired
  },

  getDefaultProps() {
    return {
      navigationWidth: 200
    };
  },

  getInitialState() {
    return {
      showMenu: false
    };
  },

  _handleClick() {
    const newShowMenu = !this.state.showMenu;

    this._toggleBodyScroll(!newShowMenu);

    this.setState({ showMenu: newShowMenu });
  },

  _toggleBodyScroll(shouldScroll) {
    document.getElementsByTagName('body')[0].style.overflow = shouldScroll ? null : 'hidden';
  },

  _getNavHandle() {
    const handleClassNames = classNames({
      'header__navigation-handle': true,
      'navigation-handle': true,
      'navigation-handle--inflated': this.state.showMenu
    });
    return (
      <div onClick={this._handleClick} className={handleClassNames} />
    );
  },
  render() {
    const {bodyComponent, headerComponent, navigationWidth} = this.props,
          {showMenu} = this.state,
          containerStyles = {
            transform: "translate3d(" + (showMenu ? navigationWidth : 0) + "px, 0, 0)"
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
            <div className="navigation__menu">
              Some Navigation here
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
