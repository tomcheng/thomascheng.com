import React from 'react';

import Carousel from "components/common/Carousel.jsx";

export default React.createClass({
  render() {
    return (
      <div>
        <div className="push-bottom">
          <Carousel
            description="These images were produced by rolling and smearing my face along the glass as the photocopied was scanning."
            images={photocopiedFaces}
            slug="photocopied-faces"
            title="Photocopied Faces"
          />
        </div>
        <div className="push-bottom">
          <Carousel
            description="Some experiments with Processing."
            images={processingFaces}
            slug="processing-faces"
            title="Processing Faces"
          />
        </div>
      </div>
    );
  }
});

const photocopiedFaces = [
  require("images/photocopied-faces/pcface4.jpg"),
  require("images/photocopied-faces/pcface1.jpg"),
  require("images/photocopied-faces/pcface2.jpg"),
  require("images/photocopied-faces/pcface3.jpg"),
  require("images/photocopied-faces/pcface7.jpg")
];

const processingFaces = [
  require("images/processing-faces/diagonal-stripe-man.jpg"),
  require("images/processing-faces/squareman.png"),
  require("images/processing-faces/discowoman.jpg"),
  require("images/processing-faces/stripeman.jpg"),
  require("images/processing-faces/circlewoman.jpg"),
  require("images/processing-faces/radiating.jpg")
];
