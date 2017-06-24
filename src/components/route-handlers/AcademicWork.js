import React from "react";
import PropTypes from "prop-types";
import withResponsiveness from "../../higher-order-components/withResponsiveness";
import Carousel from "../common/Carousel";
import PageFooter from "../common/PageFooter";
import PushBottom from "../common/PushBottom";

const PIECES = [
  {
    slug: "guide",
    title: "Typography Booklet",
    width: 704,
    height: 468,
    imageCount: 4
  },
  {
    slug: "futura",
    title: "Futura Type Specimen",
    width: 704,
    height: 468,
    imageCount: 4
  },
  {
    slug: "heart",
    title: "Meat Typography",
    width: 704,
    height: 468,
    imageCount: 1
  },
  {
    slug: "influential",
    title: "Influential Typographers Book Design",
    width: 704,
    height: 468,
    imageCount: 2
  },
  {
    slug: "diabetes",
    title: "Fast Food Typography",
    width: 704,
    height: 468,
    imageCount: 1
  },
  {
    slug: "food-economy",
    title: "Food Economy Magazine Layout",
    width: 704,
    height: 426,
    imageCount: 2
  },
  {
    slug: "durer",
    title: "Albrecht Durer Brochure",
    width: 704,
    height: 468,
    imageCount: 2
  },
  {
    slug: "robot",
    title: "Robot Games Flyer",
    width: 704,
    height: 563,
    imageCount: 1
  },
  {
    slug: "pez",
    title: "Wall o' Pez",
    width: 704,
    height: 468,
    imageCount: 1
  }
];

class AcademicWork extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired
  };

  getImages = (slug, imageCount) => {
    const images = [];

    for (let i = 0; i < imageCount; i++) {
      images.push(
        require("../../images/academic-work/" + slug + "-" + (i + 1) + ".jpg")
      );
    }

    return images;
  };

  render() {
    const { isMobile } = this.props;

    return (
      <div>
        {PIECES.map((piece, i) =>
          <PushBottom key={piece.slug}>
            <Carousel
              description={piece.description}
              height={piece.height}
              images={this.getImages(piece.slug, piece.imageCount)}
              isMobile={isMobile}
              slug={piece.slug}
              title={piece.title}
              width={piece.width}
            />
          </PushBottom>
        )}
        <PageFooter />
      </div>
    );
  }
}

export default withResponsiveness(AcademicWork);
