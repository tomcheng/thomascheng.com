import React from "react";

import {pieces} from "data/pieces.jsx";
import Header from "components/header/Header.jsx";
import PortfolioPieces from "components/portfolio/Pieces.jsx";
import Navigation from "components/navigation/Navigation.jsx";

React.initializeTouchEvents(true);

export default React.createClass({
  render() {
    return (
      <Navigation
        headerComponent={<Header />}
        bodyComponent={<PortfolioPieces pieces={pieces} />} />
    );
  }
});
