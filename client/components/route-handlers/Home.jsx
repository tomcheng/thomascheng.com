import React from "react";

import HomeMobile from "components/route-handlers/HomeMobile.jsx";
import HomeDesktop from "components/route-handlers/HomeDesktop.jsx";

export default React.createClass({
  propTypes: {
    isMobile: React.PropTypes.bool
  },

  getDefaultProps() {
    return { isMobile: false };
  },

  render() {
    return this.props.isMobile ? <HomeMobile /> : <HomeDesktop />
  }
});
