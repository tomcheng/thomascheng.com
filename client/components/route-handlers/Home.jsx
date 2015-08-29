import React from "react";
import HomeMobile from "components/route-handlers/HomeMobile.jsx";
import HomeDesktop from "components/route-handlers/HomeDesktop.jsx";
import breakPoints from "utils/breakpoints.jsx";

export default React.createClass({
  propTypes: {
    windowWidth: React.PropTypes.number.isRequired
  },

  render() {
    return (this.props.windowWidth <= breakPoints.xs.max) ? <HomeMobile /> : <HomeDesktop />;
  }
});
