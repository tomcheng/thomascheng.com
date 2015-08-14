import React from "react";
import classNames from "classnames";

import Animations from "utils/animations.jsx";
import Easings from "utils/easings.jsx";
import svgTag from "utils/svgTag.jsx";

export default React.createClass({
  getDefaultProps() {
    return { topOffset: 20 };
  },

  getInitialState() {
    return { scrollTop: 0 };
  },

  componentDidMount() {
    this._bodyEl = document.getElementsByTagName('body')[0];

    document.addEventListener("scroll", this._handleScroll);
  },

  componentWillUnmount() {
    document.removeEventListener("scroll", this._handleScroll)
  },

  _handleScroll() {
    this.setState({ scrollTop: this._bodyEl.scrollTop });
  },

  _handleClick() {
    const initialPosition = this._bodyEl.scrollTop;

    Animations.animate({
      name: 'body-scroll',
      start: initialPosition,
      end: 0,
      duration: 300,
      easing: Easings.cubicInOut,
      onUpdate: (pos) => {
        this._bodyEl.scrollTop = pos;
      }
    });
  },

  render() {
    return (
      <div>
        <div className={classNames("header", {
          "header--collapsed": this.state.scrollTop > this.props.topOffset
        })}>
          <div className="header__background"/>
          <div className="container" onClick={this._handleClick}>
            <div className="header__inner">
              <div className='header__logo' dangerouslySetInnerHTML={{__html: svgTag}} />
              <div className="header__name">Thomas Cheng</div>
              <div className="header__position">UI/UX Designer &amp; Front-End Developer</div>
            </div>
          </div>
        </div>
        <div className="header-placeholder" />
      </div>
    );
  }
});
