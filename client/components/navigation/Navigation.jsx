import React from "react";
import {Link} from "react-router";
import classNames from "classnames";

import Animations from 'utils/animations.jsx';
import Easings from 'utils/easings.jsx';

export default React.createClass({
  propTypes: {
    links: React.PropTypes.array.isRequired
  },

  getDefaultProps() {
    return { topOffset: 30 };
  },

  getInitialState() {
    return { scrollTop: 0 };
  },

  componentDidMount() {
    this.bodyEl = document.getElementsByTagName('body')[0];

    document.addEventListener("scroll", this._handleScroll);
  },

  componentWillUnmount() {
    this.bodyEl = null;

    document.removeEventListener("scroll", this._handleScroll)
  },

  _handleScroll() {
    this.setState({
      scrollTop: this.bodyEl.scrollTop
    });
  },

  _handleClick() {
    Animations.animate({
      name: 'body-scroll',
      start: this.bodyEl.scrollTop,
      end: 0,
      duration: 300,
      easing: Easings.cubicInOut,
      onUpdate: (pos) => {
        this.bodyEl.scrollTop = pos;
      }
    });
  },

  render() {
    const {links, topOffset} = this.props,
          {scrollTop} = this.state;

    return (
      <div>
        <div className={classNames("navigation", {
          "navigation--collapsed": scrollTop > topOffset
        })}>
          <div className="navigation__background" />
          <ul className="navigation__list">
            {links.map((link, i) => (
              <li key={link.title} className="navigation__item">
               {i === 0 ? null : <div className="navigation__item__divider" />}
                <Link onClick={this._handleLinkClick} to={link.path}>
                  <i className={"fa fa-" + link.icon + " navigation__item__icon"} />
                  <span className="navigation__item__text">
                    {link.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="navigation-placeholder" />
      </div>
    );
  }
});
