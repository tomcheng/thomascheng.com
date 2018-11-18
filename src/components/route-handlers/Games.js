import React from "react";
import CarouselPage from "../common/CarouselPage";

const Games = () => (
  <CarouselPage
    pieces={[
      {
        type: "link",
        title: "Socks",
        url: "https://gameswithstrangers.com",
        width: 704,
        height: 468,
        image: require("../../images/miscellaneous/socks.png")
      },
      {
        type: "link",
        title: "Dumpling Run",
        url: "https://dumplingrun.com",
        width: 704,
        height: 468,
        image: require("../../images/miscellaneous/dumpling-run.png")
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
        title: "Bunch of Quotes",
        url: "https://bunchofquotes.com",
        width: 704,
        height: 468,
        image: require("../../images/miscellaneous/bunch-of-quotes.png")
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
