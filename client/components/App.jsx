import React from "react";

import Header from "components/header/Header.jsx";
import PortfolioPieces from "components/portfolio/Pieces.jsx";

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

const pieces = [
  {
    id: 1,
    title: "Typography Guide",
    description: "A booklet of serious lessons I've learned in typography and design.",
    slug: "guide",
    images: 6
  },
  {
    id: 2,
    title: "Type Specimen",
    description: "Type specimen for Futura Book. *Warning* Inside contains sexually explicit typography intended for mature audiences.",
    slug: "futura",
    images: 6
  }
];
