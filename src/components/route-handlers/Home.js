import React from "react";
import withResponsiveness from "higher-order-components/withResponsiveness";
import HomeMobile from "components/route-handlers/HomeMobile.js";
import HomeDesktop from "components/route-handlers/HomeDesktop.js";

const Home = ({ isMobile }) => isMobile ? <HomeMobile /> : <HomeDesktop />;

Home.propTypes = {
  isMobile: React.PropTypes.bool.isRequired,
};

export default withResponsiveness(Home);
