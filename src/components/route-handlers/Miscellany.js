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
          },
          {
            type: "carousel",
            title: "Photocopied Faces",
            width: 704,
            height: 468,
            images: [
              require("../../images/photocopied-faces/pcface4.jpg"),
              require("../../images/photocopied-faces/pcface2.jpg"),
              require("../../images/photocopied-faces/pcface3.jpg"),
              require("../../images/photocopied-faces/pcface7.jpg")
            ]
          },
          {
            type: "carousel",
            title: "Experiments with Processing",
            width: 704,
            height: 468,
            images: [
              require("../../images/processing-faces/diagonal-stripe-man.jpg"),
              require("../../images/processing-faces/squareman.png"),
              require("../../images/processing-faces/discowoman.jpg"),
              require("../../images/processing-faces/circlewoman.jpg"),
              require("../../images/processing-faces/stripeman.jpg"),
              require("../../images/processing-faces/radiating.jpg")
            ]
          }
        ]
      }
    ]}
  />;

export default Miscellany;
