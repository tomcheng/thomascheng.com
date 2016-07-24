import React from "react";
import Carousel from "components/common/Carousel.jsx";
import PageFooter from "components/common/PageFooter.jsx";
import breakpoints from "utils/breakpoints.jsx";

const Miscellany = ({ windowWidth }) => (
  <div>
    <Carousel
      images={photocopiedFaces}
      slug="photocopied-faces"
      title="Photocopied Faces"
      width={704}
      height={468}
      isMobile={windowWidth <= breakpoints.xs.max}
    />
    <hr className="divider--short" />
    <Carousel
      images={processingFaces}
      slug="processing-faces"
      title="Experiments with Processing"
      width={704}
      height={468}
      isMobile={windowWidth <= breakpoints.xs.max}
    />
    <PageFooter />
  </div>
);

Miscellany.propTypes = {
  windowWidth: React.PropTypes.number.isRequired,
};

export default Miscellany;

const photocopiedFaces = [
  require("images/photocopied-faces/pcface4.jpg"),
  require("images/photocopied-faces/pcface2.jpg"),
  require("images/photocopied-faces/pcface3.jpg"),
  require("images/photocopied-faces/pcface7.jpg"),
];

const processingFaces = [
  require("images/processing-faces/diagonal-stripe-man.jpg"),
  require("images/processing-faces/squareman.png"),
  require("images/processing-faces/discowoman.jpg"),
  require("images/processing-faces/circlewoman.jpg"),
  require("images/processing-faces/stripeman.jpg"),
  require("images/processing-faces/radiating.jpg"),
];
