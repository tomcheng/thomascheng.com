import React from "react";
import CarouselPage from "../common/CarouselPage";

const Miscellany = () =>
  <CarouselPage
    groups={[
      {
        pieces: [
          {
            slug: "photocopied-faces",
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
            slug: "processing-faces",
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
