import React from "react";
import {Link, State} from "react-router";
import classNames from "classnames";

import Animations from 'utils/animations.jsx';
import Easings from 'utils/easings.jsx';
import svgTag from "utils/svgTag.jsx";

export default React.createClass({
  mixins: [State],

  propTypes: {
    links: React.PropTypes.array.isRequired
  },

  render() {
    const {links} = this.props,
          isHome = this.getPathname() === "/",
          isResume = this.getPathname() === "/resume";

    return (
      <div className={classNames("header", {
        "header--resume": isResume,
      })}>
        <div className="container relative-box">
          <div className="pull-left">
            <Link className="header__logo-container" to="/">
              <i className="fa fa-home header__logo"  />
            </Link>
            <div className="header__name-and-position">
              <Link to="/">
                <div className="header__name">Thomas Cheng</div>
                { isResume ? (
                  <div className="header__position">thomascheng81@gmail.com | 647-772-3277 | 502-160 Baldwin St, Toronto, ON, M5T 3K7</div>
                ) : (
                  <div className="header__position">Front-End Developer &amp; Designer</div>
                ) }

              </Link>
            </div>
          </div>
          { !isResume ? (
            <ul className={classNames("navigation", {"navigation--home": isHome})}>
              {links.map((link, i) => (
                <li
                  key={link.title}
                  className={classNames("navigation__item", {
                    "hidden-xs": link.hiddenOnMobile
                  })}>
                  <Link to={link.path}>
                    <span className="navigation__item__text">
                      {link.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null }
        </div>
      </div>
    );
  }
});
