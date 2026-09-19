import { Component } from "react";
import styled from "styled-components";
import breakpoints from "../../utils/breakpoints";
import NudgeBottom from "./NudgeBottom";
import ScrollIntoView from "./ScrollIntoView";
import ActiveIndicator from "./ActiveIndicator";

const displayUrl = (url: string) => url.replace(/^https?:\/\//, "");

const Image = styled.img`
  display: block;

  @media (max-width: ${breakpoints.xs.max}px) {
    border-radius: 3px;
    background-clip: padding-box;
  }
`;

type LinkPieceProps = {
  height: number;
  image: string;
  isActive: boolean;
  isMobile: boolean;
  showActiveIndicator: boolean;
  title: string;
  url: string;
  width: number;
};

type LinkPieceState = {
  containerWidth: number;
};

class LinkPiece extends Component<LinkPieceProps, LinkPieceState> {
  state: LinkPieceState = { containerWidth: 0 };

  containerEl: HTMLDivElement | null = null;

  componentDidMount() {
    this.setDimensions();
    window.addEventListener("resize", this.setDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setDimensions);
  }

  setDimensions = () => {
    if (!this.containerEl) return;
    this.setState({ containerWidth: this.containerEl.offsetWidth });
  };

  render() {
    const {
      title,
      width,
      height,
      image,
      url,
      isActive,
      showActiveIndicator,
      isMobile
    } = this.props;
    const { containerWidth } = this.state;
    const imageWidth = containerWidth;
    const imageHeight = Math.round((height / width) * containerWidth);
    return (
      <ScrollIntoView isActive={isActive}>
        <div
          ref={el => {
            this.containerEl = el;
          }}
        >
          <NudgeBottom>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>{title}</h4>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {displayUrl(url)}
              </a>
            </div>
          </NudgeBottom>
          <ActiveIndicator
            isActive={isActive && showActiveIndicator}
            isMobile={isMobile}
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              <Image
                src={image}
                width={imageWidth}
                height={imageHeight}
                style={{ width: "100%" }}
              />
            </a>
          </ActiveIndicator>
        </div>
      </ScrollIntoView>
    );
  }
}

export default LinkPiece;
