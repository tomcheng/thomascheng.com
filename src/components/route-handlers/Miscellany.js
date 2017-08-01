import React from "react";
import CarouselPage from "../common/CarouselPage";

const Miscellany = () =>
  <CarouselPage
    groups={[
      {
        pieces: [
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
        ]
      }
    ]}
  />;

export default Miscellany;
