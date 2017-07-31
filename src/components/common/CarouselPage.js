import React, { Component } from "react";
import PropTypes from "prop-types";
import withResponsiveness from "../../higher-order-components/withResponsiveness";
import ShortDivider from "./ShortDivider";
import PushBottom from "./PushBottom";
import NudgeBottom from "./NudgeBottom";
import SectionTitle from "./SectionTitle";
import CarouselLayout from "./CarouselLayout";
import LinkPiece from "./LinkPiece";
import PageFooter from "./PageFooter";
import ArrowKeys from "./ArrowKeys";
import { constrain } from "../../utils/math.js";

class CarouselPage extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
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
      })
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
    const { groups } = this.props;
    const { code, shiftKey } = evt;
    const pieces = groups.reduce(
      (pieces, group) => pieces.concat(group.pieces),
      []
    );

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

  handleClickPiece = ({ groupIndex, pieceIndex }) => {
    const { groups } = this.props;
    let previewPieces = 0;
    for (let i = 0; i < groupIndex; i++) {
      previewPieces += groups[i].pieces.length;
    }
    this.setState({ activeIndex: previewPieces + pieceIndex });
  };

  isActive = ({ groupIndex, pieceIndex }) => {
    const { groups } = this.props;
    const { activeIndex } = this.state;
    let piecesChecked = 0;

    for (let i = 0; i < groups.length; i++) {
      if (i === groupIndex) {
        return activeIndex === piecesChecked + pieceIndex;
      }

      piecesChecked += groups[i].pieces.length;
    }
  };

  render() {
    const { isMobile, groups } = this.props;
    const { keyboardUsed } = this.state;

    return (
      <div>
        {!keyboardUsed &&
          !isMobile &&
          <div style={{ position: "fixed", bottom: 10, right: 10 }}>
            <ArrowKeys />
          </div>}
        {groups.map((group, groupIndex) =>
          <div key={groupIndex}>
            {groupIndex !== 0 && <ShortDivider />}
            {group.title &&
              <NudgeBottom>
                <SectionTitle>
                  {group.title}
                </SectionTitle>
              </NudgeBottom>}
            {group.description &&
              <PushBottom>
                {group.description}
              </PushBottom>}

            {group.pieces.map((piece, pieceIndex) => {
              switch (piece.type) {
                case "carousel":
                  return (
                    <PushBottom
                      key={piece.title}
                      onClick={() => {
                        this.handleClickPiece({ groupIndex, pieceIndex });
                      }}
                    >
                      <CarouselLayout
                        title={piece.title}
                        description={piece.description}
                        images={piece.images}
                        width={piece.width}
                        height={piece.height}
                        isMobile={isMobile}
                        isActive={this.isActive({ groupIndex, pieceIndex })}
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
                        isActive={this.isActive({ groupIndex, pieceIndex })}
                        showActiveIndicator={keyboardUsed}
                      />
                    </PushBottom>
                  );
                default:
                  return null;
              }
            })}
          </div>
        )}
        <PageFooter />
      </div>
    );
  }
}

export default withResponsiveness(CarouselPage);
