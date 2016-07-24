import React from "react";
import Carousel from "components/common/Carousel.jsx";
import PageFooter from "components/common/PageFooter.jsx";
import breakpoints from "utils/breakpoints.jsx";

class AcademicWork extends React.Component {
  static propTypes = {
    windowWidth: React.PropTypes.number.isRequired,
  };

  getImages = (slug, imageCount) => {
    const images = [];

    for (let i = 0; i < imageCount; i++) {
      images.push(
        require("images/academic-work/" + slug + "-" + (i + 1) + ".jpg")
      );
    }

    return images;
  };

  render () {
    const isMobile = this.props.windowWidth <= breakpoints.xs.max;

    return (
      <div>
        {pieces.map((piece, i) => (
          <div key={piece.slug}>
            <Carousel
              description={piece.description}
              height={piece.height}
              images={this.getImages(piece.slug, piece.imageCount)}
              isMobile={isMobile}
              slug={piece.slug}
              title={piece.title}
              width={piece.width}
            />
            {i !== pieces.length - 1 ? <hr className="divider--short" /> : null}
          </div>
        ))}
        <PageFooter />
      </div>
    );
  }
}

export default AcademicWork;

const pieces = [
  {
    slug: "guide",
    title: "Typography Booklet",
    width: 704,
    height: 468,
    imageCount: 4,
  },
  {
    slug: "futura",
    title: "Futura Type Specimen",
    width: 704,
    height: 468,
    imageCount: 4,
  },
  {
    slug: "heart",
    title: "Meat Typography",
    width: 704,
    height: 468,
    imageCount: 1,
  },
  {
    slug: "influential",
    title: "Influential Typographers Book Design",
    width: 704,
    height: 468,
    imageCount: 2,
  },
  {
    slug: "diabetes",
    title: "Fast Food Typography",
    width: 704,
    height: 468,
    imageCount: 1,
  },
  {
    slug: "food-economy",
    title: "Food Economy Magazine Layout",
    width: 704,
    height: 426,
    imageCount: 2,
  },
  {
    slug: "durer",
    title: "Albrecht Durer Brochure",
    width: 704,
    height: 468,
    imageCount: 2,
  },
  {
    slug: "robot",
    title: "Robot Games Flyer",
    width: 704,
    height: 563,
    imageCount: 1,
  },
  {
    slug: "pez",
    title: "Wall o' Pez",
    width: 704,
    height: 468,
    imageCount: 1,
  },
];