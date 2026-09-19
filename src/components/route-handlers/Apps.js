import React from "react";
import CarouselPage from "../common/CarouselPage";
import img0 from "../../images/miscellaneous/insultinstitute.png";

const Apps = () => (
  <CarouselPage
    pieces={[
      {
        type: "link",
        title: "Insult Institute",
        url: "https://insultinstitute.org",
        width: 704,
        height: 468,
        image: img0
      }
    ]}
  />
);

export default Apps;
