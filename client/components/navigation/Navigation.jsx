import React from "react";

import MobileNavigation from "components/navigation/MobileNavigation.jsx";
import DesktopNavigation from "components/navigation/DesktopNavigation.jsx";

export default React.createClass({
  propTypes: {
    links: React.PropTypes.array.isRequired,
    isMobile: React.PropTypes.bool.isRequired
  },

  render() {
    const {links, isMobile} = this.props;

    return isMobile ? (
      <MobileNavigation links={links} />
    ) : (
      <DesktopNavigation links={links} />
    );
  }
});
