import React, { Component } from "react";
import PropTypes from "prop-types";
import withResponsiveness from "../../higher-order-components/withResponsiveness";
import PushBottom from "./PushBottom";
import CarouselLayout from "./CarouselLayout";
import LinkPiece from "./LinkPiece";
import PageFooter from "./PageFooter";
import ArrowKeys from "./ArrowKeys";
import { constrain } from "../../utils/math.js";

class CarouselPage extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    pieces: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          type: PropTypes.oneOf(["carousel"]).isRequired,
          images: PropTypes.arrayOf(PropTypes.string).isRequired,
          height: PropTypes.number.isRequired,
          title: PropTypes.string.isRequired,
          width: PropTypes.number.isRequired
        }),
        PropTypes.shape({
          type: PropTypes.oneOf(["link"]).isRequired,
          title: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
          image: PropTypes.string.isRequired,
          height: PropTypes.number.isRequired,
          width: PropTypes.number.isRequired
        })
      ])
    ).isRequired
  };

  state = { activeIndex: 0, keyboardUsed: false };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = evt => {
    const { pieces } = this.props;
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
        activeIndex: constrain(state.activeIndex + 1, 0, pieces.length - 1)
      }));
    } else if (code === "ArrowUp" || (code === "Space" && shiftKey)) {
      this.setState(state => ({
        ...state,
        activeIndex: constrain(state.activeIndex - 1, 0, pieces.length - 1)
      }));
    }
  };

  handleClickPiece = index => {
    this.setState({ activeIndex: index });
  };

  render() {
    const { isMobile, pieces } = this.props;
    const { activeIndex, keyboardUsed } = this.state;

    return (
      <div>
        {!keyboardUsed &&
          !isMobile &&
          <div style={{ position: "fixed", bottom: 10, right: 10 }}>
            <ArrowKeys />
          </div>}
        {pieces.map((piece, index) => {
          switch (piece.type) {
            case "carousel":
              return (
                <PushBottom
                  key={piece.title}
                  onClick={() => {
                    this.handleClickPiece(index);
                  }}
                >
                  <CarouselLayout
                    title={piece.title}
                    description={piece.description}
                    images={piece.images}
                    width={piece.width}
                    height={piece.height}
                    isMobile={isMobile}
                    isActive={index === activeIndex}
                    showActiveIndicator={keyboardUsed}
                  />
                </PushBottom>
              );
            case "link":
              return (
                <PushBottom key={piece.title}>
                  <LinkPiece
                    title={piece.title}
                    image={piece.image}
                    url={piece.url}
                    width={piece.width}
                    height={piece.height}
                    isMobile={isMobile}
                    isActive={index === activeIndex}
                    showActiveIndicator={keyboardUsed}
                  />
                </PushBottom>
              );
            default:
              return null;
          }
        })}
        <PageFooter />
      </div>
    );
  }
}

export default withResponsiveness(CarouselPage);
