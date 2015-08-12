import React from 'react';

import Carousel from "components/common/Carousel.jsx";

export default React.createClass({
  render() {
    return (
      <div>
        <div className="push-bottom">
          <Carousel
            description="These images were produced by rolling and smearing my face along the glass as the photocopied was scanning."
            images={faces}
            originalHeight={533}
            originalWidth={411}
            slug="photocopied-faces"
            title="Photocopied Faces"
          />
        </div>
      </div>
    );
  }
});

const faces = [
  require("images/photocopied-faces/pcface1.jpg"),
  require("images/photocopied-faces/pcface2.jpg"),
  require("images/photocopied-faces/pcface3.jpg"),
  require("images/photocopied-faces/pcface4.jpg"),
  require("images/photocopied-faces/pcface5.jpg"),
  require("images/photocopied-faces/pcface6.jpg"),
  require("images/photocopied-faces/pcface7.jpg")
];
