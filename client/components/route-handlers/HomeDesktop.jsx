import React from "react";

import Carousel from "components/common/Carousel.jsx";

export default React.createClass({
  render() {
    return (
      <Carousel
        images={[
          require("images/photocopied-faces/pcface1.jpg")
        ]}
        slug="desktop-home"
      />
    );
  },
});
