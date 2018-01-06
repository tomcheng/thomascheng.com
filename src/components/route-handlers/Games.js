import React from "react";
import CarouselPage from "../common/CarouselPage";

const Games = () => (
  <CarouselPage
    pieces={[
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
        title: "Voronoia",
        url: "https://voronoia.com",
        width: 704,
        height: 468,
        image: require("../../images/miscellaneous/voronoia.png")
      },
      {
        type: "link",
        title: "Roshambo AI",
        url: "https://roshamboai.com",
        width: 704,
        height: 468,
        image: require("../../images/miscellaneous/roshamboai.png")
      }
    ]}
  />
);

export default Games;
