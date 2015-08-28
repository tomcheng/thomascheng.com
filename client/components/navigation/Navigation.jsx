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
          isHome = this.getPathname() === '/';

    return (
      <div className="container">
        <div className={classNames("navigation", {
          "navigation--home": isHome
        })}>
          <Link to="/">
            <div className='navigation__logo' dangerouslySetInnerHTML={{__html: svgTag}} />
          </Link>
          <ul className="navigation__list">
            {links.map((link, i) => (
              <li key={link.title} className="navigation__item h4">
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
