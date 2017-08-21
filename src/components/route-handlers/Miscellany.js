import React from "react";
import CarouselPage from "../common/CarouselPage";

const Miscellany = () =>
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
        title: "Voronoia",
        url: "https://voronoia.com",
        width: 704,
        height: 468,
        image: require("../../images/miscellaneous/voronoia.png")
      },
      {
        type: "link",
        title: "Zen Hues",
        url: "https://zenhues.com",
        width: 704,
        height: 468,
        image: require("../../images/miscellaneous/zenhues.png")
      },
      {
        type: "link",
        title: "Blockturnal",
        url: "https://blockturnal.com",
        width: 704,
        height: 468,
        image: require("../../images/miscellaneous/blockturnal.png")
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
  />;

export default Miscellany;
