import React from "react";
import PropTypes from "prop-types";
import withResponsiveness
  from "../../higher-order-components/withResponsiveness";
import HomeMobile from "./HomeMobile.js";
import HomeDesktop from "./HomeDesktop.js";

const Home = ({ isMobile }) => isMobile ? <HomeMobile /> : <HomeDesktop />;

Home.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

export default withResponsiveness(Home);
