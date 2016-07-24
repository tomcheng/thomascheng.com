import React from "react";
import HomeMobile from "components/route-handlers/HomeMobile.js";
import HomeDesktop from "components/route-handlers/HomeDesktop.js";
import breakPoints from "utils/breakpoints.js";

const Home = ({ windowWidth }) => windowWidth <= breakPoints.xs.max
  ? <HomeMobile />
  : <HomeDesktop />;

Home.propTypes = {
  windowWidth: React.PropTypes.number.isRequired,
};

export default Home;
