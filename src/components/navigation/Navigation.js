import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Container from "../common/Container";
import breakpoints from "../../utils/breakpoints";

const LINKS = [
  { title: "Miscellaneous", path: "/miscellaneous" },
  { title: "UI/UX", path: "/ui-ux" },
  { title: "Print", path: "/print" },
  { title: "Contact", path: "/contact", hiddenOnMobile: true }
];

const Header = styled.div`
  background-color: rgba(255, 255, 255, .96);
  border-bottom: 1px solid #e0e0e0;
  top: 0;
  z-index: 1000;
  left: 0;
  position: fixed;
  width: 100%;

  @media (max-width: ${breakpoints.xs.max}px) {
    height: 45px;
  }
  @media (min-width: ${breakpoints.sm.min}px) {
    height: 70px;
    display: flex;
    align-items: center;
  }
`;

const HeaderContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const MobileLink = styled(NavLink)`
  @media (min-width: ${breakpoints.sm.min}px) {
    display: none
  }
`;

const HomeIcon = styled.i`
  font-size: 24px;
  color: #333;
`;

const DesktopLink = styled(NavLink)`
  @media (max-width: ${breakpoints.xs.max}px) {
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

const Nav = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
`;

const NavItem = styled.div`
  color: #333;
  font-size: 11px;
  font-weight: 700;
  line-height: 19px;
  text-transform: uppercase;
  letter-spacing: .5px;

  @media (max-width: ${breakpoints.xs.max}px) {
    display: ${props => (props.hiddenOnMobile ? "none" : "block")};
  }
  @media (min-width: ${breakpoints.sm.min}px) {
    font-size: 13px;
    text-transform: none;
    font-weight: 400;
    line-height: 19px;
    letter-spacing: 0;
  }
`;

const StyledNavLink = styled(NavLink)`
  opacity: 0.2;
  color: #333;
  display: block;
  line-height: 40px;
  padding: 1px 7px 0;
  vertical-align: center;
  
  &.active {
    opacity: 1;
  }
  &:hover, &:active {
    color: #333;
  }
`;

const NavLinkHome = styled(StyledNavLink)`
  color: #333;
  opacity: 1;

  &:hover, &:active {
    color: #333;
  }
`;

const NavText = styled.span`
  padding-bottom: 3px;

  @media (min-width: ${breakpoints.sm.min}px) {
    .active &,
    &:hover {
      border-bottom: 3px solid #333;
    }
  }
`;

const Navigation = ({ location }) => {
  const isHome = location.pathname === "/";
  const isResume = location.pathname === "/resume";

  const LinkComponent = isHome ? NavLinkHome : StyledNavLink;
  return (
    <Header>
      <HeaderContainer>
        <MobileLink to="/">
          <HomeIcon className="fa fa-home" />
        </MobileLink>
        <DesktopLink to="/">
          <Name>Thomas Cheng</Name>
          {isResume
            ? <Position>
                thomascheng81@gmail.com | 647-772-3277 | 502-160 Baldwin St,
                Toronto, ON, M5T 3K7
              </Position>
            : <Position>Developer & Designer</Position>}
        </DesktopLink>
        {!isResume
          ? <Nav>
              {LINKS.map((link, i) =>
                <NavItem key={link.title} hiddenOnMobile={link.hiddenOnMobile}>
                  <LinkComponent to={link.path}>
                    <NavText>
                      {link.title}
                    </NavText>
                  </LinkComponent>
                </NavItem>
              )}
            </Nav>
          : null}
      </HeaderContainer>
    </Header>
  );
};

Navigation.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default Navigation;
