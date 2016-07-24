import React from "react";
import { Link } from "react-router";
import classNames from "classnames";

const Navigation = ({ links, location }) => {
  const isHome = location.pathname === "/";
  const isResume = location.pathname === "/resume";

  return (
    <div className={classNames("header", {
      "header--resume": isResume,
    })}>
      <div className="container relative-box">
        <div className="pull-left">
          <Link className="header__logo-container" to="/">
            <i className="fa fa-home header__logo" />
          </Link>
          <div className="header__name-and-position">
            <Link to="/">
              <div className="header__name">Thomas Cheng</div>
              {isResume ? (
                <div className="header__position">
                  thomascheng81@gmail.com | 647-772-3277 | 502-160 Baldwin St, Toronto, ON, M5T 3K7
                </div>
              ) : (
                <div className="header__position">Front-End Developer &amp; Designer</div>
              )}

            </Link>
          </div>
        </div>
        {!isResume ? (
          <ul className={classNames("navigation", {"navigation--home": isHome})}>
            {links.map((link, i) => (
              <li
                key={link.title}
                className={classNames("navigation__item", {
                  "hidden-xs": link.hiddenOnMobile,
                })}
              >
                <Link to={link.path}>
                  <span className="navigation__item__text">
                    {link.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

Navigation.propTypes = {
  links: React.PropTypes.array.isRequired,
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
  }).isRequired,
};

export default Navigation;
