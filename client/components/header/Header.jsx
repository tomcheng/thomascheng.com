import React from "react";
import classNames from "classnames";
import {State} from "react-router";

import Animations from "utils/animations.jsx";
import Easings from "utils/easings.jsx";
import svgTag from "utils/svgTag.jsx";

export default React.createClass({
  mixins: [State],

  propTypes: {
    menuShown: React.PropTypes.bool,
    navigationHandle: React.PropTypes.element,
    navigationOffset: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      menuShown: false,
      navigationHandle: null,
      navigationOffset: 0,
      topOffset: 20
    };
  },

  getInitialState() {
    return {
      scrollTop: 0
    }
  },

  componentDidMount() {
    document.addEventListener("scroll", this._handleScroll);
  },

  componentWillUnmount() {
    document.removeEventListener("scroll", this._handleScroll)
  },

  _handleScroll() {
    this.setState({
      scrollTop: document.getElementsByTagName('body')[0].scrollTop
    });
  },

  _handleClick() {
    const bodyEl = document.getElementsByTagName('body')[0],
          initialPosition = bodyEl.scrollTop;

    Animations.animate({
      name: 'body-scroll',
      start: initialPosition,
      end: 0,
      duration: 300,
      easing: Easings.cubicInOut,
      onUpdate: (pos) => {
        bodyEl.scrollTop = pos;
      }
    });
  },

  render() {
    const {menuShown, navigationHandle, navigationOffset, topOffset} = this.props,
          {scrollTop} = this.state,
          headerClasses = classNames("header", {
            "header--affixed": scrollTop > topOffset,
            "header--home": this.getPath() === "/"
          }),
          headerStyles = {
            transform: "translate3d(" + navigationOffset + "px, 0, 0)"
          };

    return (
      <div className={headerClasses} style={headerStyles}>
        {navigationHandle}
        <div className="header__background"/>
        <div className="container" onClick={this._handleClick}>
          <div className="header__inner">
            <div className='header__logo' dangerouslySetInnerHTML={{__html: svgTag}} />
            <div className="header__name">Thomas Cheng</div>
            <div className="header__position">UI/UX Designer &amp; Front-End Developer</div>
          </div>
          <div className="header__border" />
        </div>
      </div>
    );
  }
});
