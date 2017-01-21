import React from "react";
import { Link } from "react-router";
import styled from "styled-components";
import classNames from "classnames";

const LINKS = [
  { title: "Work", path: "/work" },
  { title: "Academic Work", path: "/academic-work" },
  { title: "Miscellany", path: "/miscellany" },
  { title: "Contact", path: "/contact", hiddenOnMobile: true },
];

const Header = styled.div`
  background-color: rgba(255, 255, 255, .96);
  border-bottom: 1px solid #e0e0e0;
  top: 0;
  z-index: 1000;
  left: 0;
  position: fixed;
  width: 100%;

  @media (max-width: 767px) {
    height: 45px;
  }
  @media (min-width: 768px) {
    height: 70px;
    display: flex;
    align-items: center;
  }
`;

const Container = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  margin-right: auto;
  margin-left: auto;
  @media (min-width: 768px) {
    width: 750px
  }
  @media (min-width: 992px) {
    width: 970px
  }
`;

const MobileLink = styled(Link)`
  @media (min-width: 768px) {
    display: none
  }
`;

const HomeIcon = styled.i`
  font-size: 24px;
  color: #333;
`;

const DesktopLink = styled(Link)`
  @media (max-width: 767px) {
    display: none;
  }
`;

const Name = styled.div`
  color: #333;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: Raleway, sans-serif;
`;

const Position = styled.div`
  color: #666;
  font-style: italic;
  font-size: 13px;
`;

const Navigation = ({ location }) => {
  const isHome = location.pathname === "/";
  const isResume = location.pathname === "/resume";

  return (
    <Header>
      <Container style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
      }}>
        <MobileLink to="/">
          <HomeIcon className="fa fa-home" />
        </MobileLink>
        <DesktopLink to="/">
          <Name>
            Thomas Cheng
          </Name>
          {isResume ? (
            <Position>
              thomascheng81@gmail.com | 647-772-3277 | 502-160 Baldwin St, Toronto, ON, M5T 3K7
            </Position>
          ) : (
            <Position>
              Front-End Developer &amp; Designer
            </Position>
          )}
        </DesktopLink>
        {!isResume ? (
          <ul className={classNames("navigation", {"navigation--home": isHome})}>
            {LINKS.map((link, i) => (
              <li
                key={link.title}
                className={classNames("navigation__item", {
                  "hidden-xs": link.hiddenOnMobile,
                })}
              >
                <Link to={link.path} activeClassName="active">
                  <span className="navigation__item__text">
                    {link.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </Header>
  );
};

Navigation.propTypes = {
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
  }).isRequired,
};

export default Navigation;
