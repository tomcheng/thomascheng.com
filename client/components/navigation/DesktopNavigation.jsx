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

  render() {
    const {links} = this.props;

    return (
      <div>
        <div className='desktop-nav'>
          <ul className="desktop-nav__list">
            {links.map((link) => (
              !link.mobileOnly ? (
                <li key={link.title} className="desktop-nav__item">
                  <Link to={link.path}>
                    <i className={"fa fa-fw fa-arrow-right desktop-nav__item__icon"} />
                    <span className="desktop-nav__item__text">
                      {link.title}
                    </span>
                  </Link>
                </li>
              ) : null
            ))}
          </ul>
        </div>
      </div>
    );
  }
});
