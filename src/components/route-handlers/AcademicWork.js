import React from "react";
import CarouselPage from "../common/CarouselPage";

const AcademicWork = () =>
  <CarouselPage
    groups={[
      {
        pieces: [
          {
            type: "carousel",
            title: "Typography Booklet",
            width: 704,
            height: 468,
            images: [
              require("../../images/academic-work/guide-1.jpg"),
              require("../../images/academic-work/guide-2.jpg"),
              require("../../images/academic-work/guide-3.jpg"),
              require("../../images/academic-work/guide-4.jpg")
            ]
          },
          {
            type: "carousel",
            title: "Futura Type Specimen",
            width: 704,
            height: 468,
            images: [
              require("../../images/academic-work/futura-1.jpg"),
              require("../../images/academic-work/futura-2.jpg"),
              require("../../images/academic-work/futura-3.jpg"),
              require("../../images/academic-work/futura-4.jpg")
            ]
          },
          {
            type: "carousel",
            title: "Meat Typography",
            width: 704,
            height: 468,
            images: [require("../../images/academic-work/heart-1.jpg")]
          },
          {
            type: "carousel",
            title: "Influential Typographers Book Design",
            width: 704,
            height: 468,
            images: [
              require("../../images/academic-work/influential-1.jpg"),
              require("../../images/academic-work/influential-2.jpg")
            ]
          },
          {
            type: "carousel",
            title: "Fast Food Typography",
            width: 704,
            height: 468,
            images: [require("../../images/academic-work/diabetes-1.jpg")]
          },
          {
            type: "carousel",
            title: "Food Economy Magazine Layout",
            width: 704,
            height: 426,
            images: [
              require("../../images/academic-work/food-economy-1.jpg"),
              require("../../images/academic-work/food-economy-2.jpg")
            ]
          },
          {
            type: "carousel",
            title: "Albrecht Durer Brochure",
            width: 704,
            height: 468,
            images: [
              require("../../images/academic-work/durer-1.jpg"),
              require("../../images/academic-work/durer-2.jpg")
            ]
          },
          {
            type: "carousel",
            title: "Robot Games Flyer",
            width: 704,
            height: 563,
            images: [require("../../images/academic-work/robot-1.jpg")]
          },
          {
            type: "carousel",
            title: "Wall o' Pez",
            width: 704,
            height: 468,
            images: [require("../../images/academic-work/pez-1.jpg")]
          }
        ]
      }
    ]}
  />;

export default AcademicWork;
