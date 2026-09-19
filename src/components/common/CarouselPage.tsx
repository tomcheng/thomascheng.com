import { Component } from "react";
import withResponsiveness from "../../higher-order-components/withResponsiveness";
import PushBottom from "./PushBottom";
import CarouselLayout from "./CarouselLayout";
import LinkPiece from "./LinkPiece";
import PageFooter from "./PageFooter";
import type { Piece } from "../../types/piece";

// Minimum pieces before the scroll-to-top footer is worth showing.
const MIN_PIECES_FOR_FOOTER = 3;

type CarouselPageProps = {
  isMobile: boolean;
  pieces: Piece[];
};

type CarouselPageState = {
  activeIndex: number;
};

class CarouselPage extends Component<CarouselPageProps, CarouselPageState> {
  state: CarouselPageState = { activeIndex: 0 };

  handleClickPiece = (index: number) => {
    this.setState({ activeIndex: index });
  };

  render() {
    const { isMobile, pieces } = this.props;
    const { activeIndex } = this.state;

    return (
      <div>
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
                  />
                </PushBottom>
              );
            default:
              return null;
          }
        })}
        {/* The footer is a scroll-to-top control, so it only earns its place
            on a page long enough to scroll. Below three pieces there is
            nowhere to scroll back from. */}
        {pieces.length >= MIN_PIECES_FOR_FOOTER && <PageFooter />}
      </div>
    );
  }
}

export default withResponsiveness(CarouselPage);
