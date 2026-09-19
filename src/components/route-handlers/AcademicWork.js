import React from "react";
import CarouselPage from "../common/CarouselPage";
import img0 from "../../images/academic-work/guide-1.jpg";
import img1 from "../../images/academic-work/guide-2.jpg";
import img2 from "../../images/academic-work/guide-3.jpg";
import img3 from "../../images/academic-work/guide-4.jpg";
import img4 from "../../images/academic-work/futura-1.jpg";
import img5 from "../../images/academic-work/futura-2.jpg";
import img6 from "../../images/academic-work/futura-3.jpg";
import img7 from "../../images/academic-work/futura-4.jpg";
import img8 from "../../images/academic-work/heart-1.jpg";
import img9 from "../../images/academic-work/influential-1.jpg";
import img10 from "../../images/academic-work/influential-2.jpg";
import img11 from "../../images/academic-work/diabetes-1.jpg";
import img12 from "../../images/academic-work/food-economy-1.jpg";
import img13 from "../../images/academic-work/food-economy-2.jpg";
import img14 from "../../images/academic-work/durer-1.jpg";
import img15 from "../../images/academic-work/durer-2.jpg";
import img16 from "../../images/academic-work/robot-1.jpg";
import img17 from "../../images/photocopied-faces/pcface4.jpg";
import img18 from "../../images/photocopied-faces/pcface2.jpg";
import img19 from "../../images/photocopied-faces/pcface3.jpg";
import img20 from "../../images/photocopied-faces/pcface7.jpg";
import img21 from "../../images/processing-faces/diagonal-stripe-man.jpg";
import img22 from "../../images/processing-faces/squareman.png";
import img23 from "../../images/processing-faces/discowoman.jpg";
import img24 from "../../images/processing-faces/circlewoman.jpg";
import img25 from "../../images/processing-faces/stripeman.jpg";
import img26 from "../../images/processing-faces/radiating.jpg";
import img27 from "../../images/academic-work/pez-1.jpg";

const AcademicWork = () => (
  <CarouselPage
    pieces={[
      {
        type: "carousel",
        title: "Typography Booklet",
        width: 704,
        height: 468,
        images: [
          img0,
          img1,
          img2,
          img3
        ]
      },
      {
        type: "carousel",
        title: "Futura Type Specimen",
        width: 704,
        height: 468,
        images: [
          img4,
          img5,
          img6,
          img7
        ]
      },
      {
        type: "carousel",
        title: "Meat Typography",
        width: 704,
        height: 468,
        images: [img8]
      },
      {
        type: "carousel",
        title: "Influential Typographers Book Design",
        width: 704,
        height: 468,
        images: [
          img9,
          img10
        ]
      },
      {
        type: "carousel",
        title: "Fast Food Typography",
        width: 704,
        height: 468,
        images: [img11]
      },
      {
        type: "carousel",
        title: "Food Economy Magazine Layout",
        width: 704,
        height: 426,
        images: [
          img12,
          img13
        ]
      },
      {
        type: "carousel",
        title: "Albrecht Durer Brochure",
        width: 704,
        height: 468,
        images: [
          img14,
          img15
        ]
      },
      {
        type: "carousel",
        title: "Robot Games Flyer",
        width: 704,
        height: 563,
        images: [img16]
      },
      {
        type: "carousel",
        title: "Photocopied Faces",
        width: 704,
        height: 468,
        images: [
          img17,
          img18,
          img19,
          img20
        ]
      },
      {
        type: "carousel",
        title: "Experiments with Processing",
        width: 704,
        height: 468,
        images: [
          img21,
          img22,
          img23,
          img24,
          img25,
          img26
        ]
      },
      {
        type: "carousel",
        title: "Wall o' Pez",
        width: 704,
        height: 468,
        images: [img27]
      }
    ]}
  />
);

export default AcademicWork;
