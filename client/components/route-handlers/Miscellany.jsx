import React from "react";
import Carousel from "components/common/Carousel.jsx";
import PageFooter from "components/common/PageFooter.jsx";
import breakpoints from "utils/breakpoints.jsx";

export default React.createClass({
  propTypes: {
    windowWidth: React.PropTypes.number.isRequired
  },

  render() {
    const isMobile = this.props.windowWidth <= breakpoints.xs.max;

    return (
      <div>
        <Carousel
          images={photocopiedFaces}
          slug="photocopied-faces"
          title="Photocopied Faces"
          width={704}
          height={468}
          isMobile={isMobile}
        />
        <hr className="divider--short" />
        <Carousel
          images={funWithType}
          slug="fun-with-type"
          title="Fun With Type"
          width={600}
          height={400}
          isMobile={isMobile}
        />
        <hr className="divider--short" />
        <Carousel
          images={processingFaces}
          slug="processing-faces"
          title="Experiments with Processing"
          width={704}
          height={468}
          isMobile={isMobile}
        />
        <PageFooter />
      </div>
    );
  }
});

const photocopiedFaces = [
  require("images/photocopied-faces/pcface4.jpg"),
  require("images/photocopied-faces/pcface2.jpg"),
  require("images/photocopied-faces/pcface3.jpg"),
  require("images/photocopied-faces/pcface7.jpg")
];

const processingFaces = [
  require("images/processing-faces/diagonal-stripe-man.jpg"),
  require("images/processing-faces/squareman.png"),
  require("images/processing-faces/discowoman.jpg"),
  require("images/processing-faces/circlewoman.jpg"),
  require("images/processing-faces/stripeman.jpg"),
  require("images/processing-faces/radiating.jpg")
];

const funWithType = [
  require("images/fun-with-type/assassinate.png"),
  require("images/fun-with-type/clip.png"),
  require("images/fun-with-type/evolve.png"),
  require("images/fun-with-type/exasperate.png"),
  require("images/fun-with-type/fit.png"),
  require("images/fun-with-type/grope.png"),
  require("images/fun-with-type/hit.png"),
  require("images/fun-with-type/lie.png"),
  require("images/fun-with-type/melt.png"),
  require("images/fun-with-type/misplace.png"),
  require("images/fun-with-type/seethe.png"),
  require("images/fun-with-type/segregate.png"),
  require("images/fun-with-type/sharpen.png"),
  require("images/fun-with-type/stink.png"),
  require("images/fun-with-type/trap.png")
];
