import React from "react";
import CarouselPage from "../common/CarouselPage";

const Apps = () => (
  <CarouselPage
    pieces={[
      {
        type: "link",
        title: "Quotes",
        url: "https://bunchofquotes.com",
        width: 704,
        height: 468,
        image: require("../../images/miscellaneous/bunch-of-quotes.png")
      },
      {
        type: "link",
        title: "Notorist",
        url: "https://notorist.com",
        width: 704,
        height: 468,
        image: require("../../images/miscellaneous/notorist.png")
      },
      {
        type: "link",
        title: "Insult Institute",
        url: "https://insultinstitute.org",
        width: 704,
        height: 468,
        image: require("../../images/miscellaneous/insultinstitute.png")
      }
    ]}
  />
);

export default Apps;
