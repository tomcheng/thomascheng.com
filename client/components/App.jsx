import React from "react";

import Header from "components/header/Header.jsx";
import PortfolioPieces from "components/portfolio/Pieces.jsx";
import {pieces} from "data/pieces.jsx";

export default React.createClass({
  render() {
    return (
      <div className="container">
        <Header />
        <PortfolioPieces
          pieces={pieces} />
      </div>
    );
  }
});
