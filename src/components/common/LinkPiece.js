import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import breakpoints from "../../utils/breakpoints";
import NudgeBottom from "./NudgeBottom";
import ScrollIntoView from "./ScrollIntoView";
import ActiveIndicator from "./ActiveIndicator";

const displayUrl = url => url.replace(/^https?:\/\//, "");

const Image = styled.img`
  display: block;

  @media (max-width: ${breakpoints.xs.max}px) {
    border-radius: 3px;
    background-clip: padding-box;
  }
`;

class LinkPiece extends Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    showActiveIndicator: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired
  };

  state = { containerWidth: 0 };

  containerEl = null;

  componentDidMount() {
    this.setDimensions();
    window.addEventListener("resize", this.setDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setDimensions);
  }

  setDimensions = () => {
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
    const imageHeight = Math.round(height / width * containerWidth);
    return (
      <ScrollIntoView isActive={isActive}>
        <div
          ref={el => {
            this.containerEl = el;
          }}
        >
          <NudgeBottom>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>
                {title}
              </h4>
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
