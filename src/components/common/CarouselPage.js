import React from "react";
import PropTypes from "prop-types";
import withResponsiveness from "../../higher-order-components/withResponsiveness";
import Carousel from "./Carousel";
import PageFooter from "./PageFooter";
import PushBottom from "./PushBottom";
import ArrowKeys from "./ArrowKeys";
import { constrain } from "../../utils/math.js";

class CarouselPage extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    groups: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      pieces: PropTypes.arrayOf(PropTypes.shape({
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
        height: PropTypes.number.isRequired,
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired
      })).isRequired,
    })).isRequired,
  };

  state = { activeIndex: 0, keyboardUsed: false };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = evt => {
    const { groups } = this.props;
    const { code, shiftKey } = evt;
    const pieces = groups.reduce((pieces, group) => pieces.concat(group.pieces), []);

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
    const { isMobile, groups } = this.props;
    const { activeIndex, keyboardUsed } = this.state;

    return (
      <div>
        {!keyboardUsed && !isMobile &&
        <div style={{ position: "fixed", bottom: 10, right: 10 }}>
          <ArrowKeys />
        </div>}
        {groups.map((group, i) => (
          <div key={i}>
            {group.pieces.map((piece, i) =>
              <PushBottom
                key={piece.slug}
                onClick={() => {
                  this.handleClickPiece(i);
                }}
              >
                <Carousel
                  title={piece.title}
                  description={piece.description}
                  images={piece.images}
                  slug={piece.slug}
                  width={piece.width}
                  height={piece.height}
                  isMobile={isMobile}
                  isActive={i === activeIndex}
                  showActiveIndicator={keyboardUsed}
                />
              </PushBottom>
            )}
          </div>
        ))}
        <PageFooter />
      </div>
    );
  }
}

export default withResponsiveness(CarouselPage);
