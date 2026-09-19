import React from "react";
import styled from "styled-components";
import NudgeBottom from "./NudgeBottom";
import ScrollIntoView from "./ScrollIntoView";
import Carousel from "./Carousel";

const HeaderWithTitleOnly = styled(NudgeBottom)`
  display: flex;
  justify-content: space-between;
`;

const Counter = styled.div`
  user-select: none;
  color: #aaa;
  cursor: pointer;
  font-size: 12px;
  line-height: 19px;
  font-weight: 400;
  font-style: italic;
  align-self: flex-end;
  min-width: 45px;
  text-align: right;
`;

type CarouselLayoutProps = {
  height: number;
  images: string[];
  isActive: boolean;
  isMobile: boolean;
  showActiveIndicator: boolean;
  width: number;
  description?: string;
  title?: string;
};

type CarouselLayoutState = {
  currentPane: number;
};

class CarouselLayout extends React.Component<
  CarouselLayoutProps,
  CarouselLayoutState
> {
  state: CarouselLayoutState = { currentPane: 0 };

  carouselEl: Carousel | null = null;

  renderCounter = () =>
    this.props.images.length > 1 && (
      <Counter onClick={this.handleClickCounter}>
        {`${this.state.currentPane + 1} of ${this.props.images.length}`}
      </Counter>
    );

  handleClickCounter = () => {
    if (!this.carouselEl) return;
    this.carouselEl.goToNextPane();
  };

  handleUpdatePane = (pane: number) => {
    this.setState({ currentPane: pane });
  };

  render() {
    const { description, title, isActive, ...other } = this.props;

    return (
      <ScrollIntoView isActive={isActive}>
        <div style={{ touchAction: "pan-y" }}>
          {description ? (
            <NudgeBottom>
              <h4>{title}</h4>
              <NudgeBottom>{description}</NudgeBottom>
              <NudgeBottom>{this.renderCounter()}</NudgeBottom>
            </NudgeBottom>
          ) : (
            <HeaderWithTitleOnly>
              <h4>{title}</h4>
              {this.renderCounter()}
            </HeaderWithTitleOnly>
          )}
          <Carousel
            {...other}
            isActive={isActive}
            onUpdatePane={this.handleUpdatePane}
            ref={el => {
              this.carouselEl = el;
            }}
          />
        </div>
      </ScrollIntoView>
    );
  }
}

export default CarouselLayout;
