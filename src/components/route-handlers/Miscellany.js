import React from "react";
import withResponsiveness from "higher-order-components/withResponsiveness";
import Carousel from "components/common/Carousel";
import PageFooter from "components/common/PageFooter";

const PHOTOCOPIED_FACES = [
  require("images/photocopied-faces/pcface4.jpg"),
  require("images/photocopied-faces/pcface2.jpg"),
  require("images/photocopied-faces/pcface3.jpg"),
  require("images/photocopied-faces/pcface7.jpg"),
];

const PROCESSING_IMAGES = [
  require("images/processing-faces/diagonal-stripe-man.jpg"),
  require("images/processing-faces/squareman.png"),
  require("images/processing-faces/discowoman.jpg"),
  require("images/processing-faces/circlewoman.jpg"),
  require("images/processing-faces/stripeman.jpg"),
  require("images/processing-faces/radiating.jpg"),
];

const Miscellany = ({ isMobile }) => (
  <div>
    <Carousel
      images={PHOTOCOPIED_FACES}
      slug="photocopied-faces"
      title="Photocopied Faces"
      width={704}
      height={468}
      isMobile={isMobile}
    />
    <hr className="divider--short" />
    <Carousel
      images={PROCESSING_IMAGES}
      slug="processing-faces"
      title="Experiments with Processing"
      width={704}
      height={468}
      isMobile={isMobile}
    />
    <PageFooter />
  </div>
);

Miscellany.propTypes = {
  isMobile: React.PropTypes.bool.isRequired,
};

export default withResponsiveness(Miscellany);
