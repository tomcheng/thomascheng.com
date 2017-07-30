import React from "react";
import PropTypes from "prop-types";
import withResponsiveness from "../../higher-order-components/withResponsiveness";
import Carousel from "../common/Carousel";
import PageFooter from "../common/PageFooter";
import PushBottom from "../common/PushBottom";
import ArrowKeys from "../common/ArrowKeys";
import { constrain } from "../../utils/math.js";

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

  state = { activeIndex: 0, keyboardUsed: false };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = evt => {
    const { code, shiftKey } = evt;

    if (
      ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Space"].includes(
        code
      )
    ) {
      evt.preventDefault();
      this.setState(state => ({
        ...state,
        keyboardUsed: true
      }));
    }

    if (code === "ArrowDown" || (code === "Space" && !shiftKey)) {
      this.setState(state => ({
        ...state,
        activeIndex: constrain(state.activeIndex + 1, 0, PIECES.length - 1)
      }));
    } else if (code === "ArrowUp" || (code === "Space" && shiftKey)) {
      this.setState(state => ({
        ...state,
        activeIndex: constrain(state.activeIndex - 1, 0, PIECES.length - 1)
      }));
    }
  };

  handleHover = index => {
    this.setState({ activeIndex: index });
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
    const { activeIndex, keyboardUsed } = this.state;

    return (
      <div>
        {!keyboardUsed && !isMobile &&
          <div style={{ position: "fixed", bottom: 10, right: 10 }}>
            <ArrowKeys />
          </div>}
        {PIECES.map((piece, i) =>
          <PushBottom
            key={piece.slug}
            onClick={() => {
              this.handleHover(i);
            }}
          >
            <Carousel
              title={piece.title}
              description={piece.description}
              images={this.getImages(piece.slug, piece.imageCount)}
              slug={piece.slug}
              width={piece.width}
              height={piece.height}
              isMobile={isMobile}
              isActive={i === activeIndex}
              showActiveIndicator={keyboardUsed}
            />
          </PushBottom>
        )}
        <PageFooter />
      </div>
    );
  }
}

export default withResponsiveness(AcademicWork);
