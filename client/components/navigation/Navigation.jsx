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
          isHome = this.getPathname() === "/";

    return (
      <div className="header">
        <div className="container relative-box">
          <div className="pull-left">
            <Link to="/">
              <div className="header__logo" dangerouslySetInnerHTML={{__html: svgTag}} />
            </Link>
            <div className="header__name-and-position">
              <Link to="/">
                <div className="header__name">Thomas Cheng</div>
                <div className="header__position">UI/UX Designer &amp; Front-End Developer</div>
              </Link>
            </div>
          </div>
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
        </div>
      </div>
    );
  }
});
