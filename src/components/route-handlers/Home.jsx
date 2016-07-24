import React from "react";
import HomeMobile from "components/route-handlers/HomeMobile.jsx";
import HomeDesktop from "components/route-handlers/HomeDesktop.jsx";
import breakPoints from "utils/breakpoints.jsx";

const Home = ({ windowWidth }) => windowWidth <= breakPoints.xs.max
  ? <HomeMobile />
  : <HomeDesktop />;

Home.propTypes = {
  windowWidth: React.PropTypes.number.isRequired,
};

export default Home;
