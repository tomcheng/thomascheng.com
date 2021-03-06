import React from "react";
import PropTypes from "prop-types";
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

class CarouselLayout extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    images: PropTypes.array.isRequired,
    isActive: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    showActiveIndicator: PropTypes.bool.isRequired,
    width: PropTypes.number.isRequired,
    description: PropTypes.string,
    title: PropTypes.string
  };

  state = { currentPane: 0 };

  renderCounter = () =>
    this.props.images.length > 1 && (
      <Counter onClick={this.handleClickCounter}>
        {`${this.state.currentPane + 1} of ${this.props.images.length}`}
      </Counter>
    );

  handleClickCounter = () => {
    this.carouselEl.goToNextPane();
  };

  handleUpdatePane = pane => {
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
