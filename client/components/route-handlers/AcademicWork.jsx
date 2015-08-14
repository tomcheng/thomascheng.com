import React from "react";
import classNames from "classnames";
import Carousel from "components/common/Carousel.jsx";

export default React.createClass({
  _getImages(slug, imageCount) {
    const images = [];

    for (let i = 0; i < imageCount; i++) {
      images.push(
        require("images/academic-work/" + slug + "-" + (i + 1) + ".jpg")
      );
    }

    return images;
  },

  render() {
    return (
      <div>
        {pieces.map(piece => (
          <div key={piece.slug} className="push-bottom">
            <Carousel
              description={piece.description}
              images={this._getImages(piece.slug, piece.imageCount)}
              slug={piece.slug}
              title={piece.title}
            />
          </div>
        ))}
      </div>
    );
  }
});

const pieces = [
  {
    slug: "guide",
    title: "Typography Guide",
    description: "A booklet of serious lessons I've learned in typography and design.",
    width: 704,
    height: 468,
    imageCount: 6
  },
  {
    slug: "futura",
    title: "Type Specimen",
    description: "Type specimen for Futura Book. *Warning* Inside contains sexually explicit typography intended for mature audiences.",
    width: 704,
    height: 468,
    imageCount: 6
  },
  {
    slug: "foodland",
    title: "Foodland Ontario",
    description: "Foodland Ontario mailer targeted to senior citizens.",
    width: 704,
    height: 468,
    imageCount: 4
  },
  {
    slug: "food-economy",
    title: "Food Economy",
    description: "Magazine layout for a target audience of affluent, educated professionals.",
    width: 704,
    height: 426,
    imageCount: 2
  },
  {
    slug: "two-fonts",
    title: "Rebellion!",
    description: "A project to combine three fonts to make a new one, and using it to express an appropriate phrase.",
    width: 704,
    height: 468,
    imageCount: 1
  },
  {
    slug: "diabetes",
    title: "Fast Food Typography",
    description: "Yummy lettering.",
    width: 704,
    height: 468,
    imageCount: 1
  },
  {
    slug: "heart",
    title: "Hey Man",
    description: "<3",
    width: 704,
    height: 468,
    imageCount: 1
  },
  {
    slug: "influential",
    title: "Influential Typographers",
    description: "Design and production of a book on influential type designers.",
    width: 704,
    height: 468,
    imageCount: 3
  }
];
