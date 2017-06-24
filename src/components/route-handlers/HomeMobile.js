import React from "react";
import styled from "styled-components";

const FIRST_FRAME_ENTER = 2;
const SECOND_FRAME_ENTER = 8;
const BOTH_FRAMES_LEAVE = 16;

const IMAGES = [
  require("../../images/home/3Dproj2-low-res.jpg"),
  require("../../images/home/circleboy.jpg"),
  require("../../images/home/circlewoman.jpg"),
  require("../../images/home/diabetes-low-res.jpg"),
  require("../../images/home/diagonal-stripe-man.jpg"),
  require("../../images/home/discowoman.jpg"),
  require("../../images/home/DSC_4252_small-low-res.jpg"),
  require("../../images/home/DSC_4757_small-low-res.jpg"),
  require("../../images/home/DSC_5209_small-low-res.jpg"),
  require("../../images/home/DSC_5211_small-low-res.jpg"),
  require("../../images/home/DSC_5230_small-low-res.jpg"),
  require("../../images/home/durer-low-res.jpg"),
  require("../../images/home/foodbrochure-low-res.jpg"),
  require("../../images/home/futura-1-low-res.jpg"),
  require("../../images/home/futura-5-low-res.jpg"),
  require("../../images/home/guide-1-low-res.jpg"),
  require("../../images/home/iheartyou-low-res.jpg"),
  require("../../images/home/influential-low-res.jpg"),
  require("../../images/home/localfood-low-res.jpg"),
  require("../../images/home/localfood2-low-res.jpg"),
  require("../../images/home/localfood3-low-res.jpg"),
  require("../../images/home/officers.jpg"),
  require("../../images/home/pcface1.jpg"),
  require("../../images/home/pcface2.jpg"),
  require("../../images/home/pcface4.jpg"),
  require("../../images/home/pcface5.jpg"),
  require("../../images/home/radiating.jpg"),
  require("../../images/home/robotgames-low-res.jpg"),
  require("../../images/home/scanface1.jpg"),
  require("../../images/home/squareman.jpg"),
  require("../../images/home/squareman2.jpg"),
  require("../../images/home/stripeman.jpg"),
  require("../../images/home/strippedfaces.jpg"),
  require("../../images/home/twofonts-low-res.jpg")
];

const shuffleArray = array => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const Footer = styled.div`
  position: fixed;
  bottom: 15px;
  left: 0;
  right: 0;
  text-align: center;
`;

const TriggerContainer = styled.div`
  left: 0;
  margin: -40px auto 0;
  position: fixed;
  right: 0;
  text-align: center;
  top: 50%;
  width: 250px;
  z-index: 1010;
  user-select: none;
`;

const Trigger = styled.div`
  font-family: Raleway, sans-serif;
  transition: all .06s ease-in;
  color: ${props => (props.isFlashing ? "#fff" : "#333")};
  font-weight: 900;
  text-transform: uppercase;
  font-size: 16px;
  letter-spacing: .5px;
  border-bottom: 8px solid ${props => (props.isFlashing ? "#fff" : "#333")};
  display: inline-block;
  padding: 0 10px 5px;
  margin-bottom: 15px;
  position: relative;
  transform: scale3d(${props =>
    props.isFlashing ? "1.2, 1.2, 1" : "1, 1, 1"});
`;

const Subtitle = styled.div`
  .is-flashing & {
    opacity: 0;
  }
`;

const Message = styled.div`
  left: 0;
  position: fixed;
  width: 100%;
  text-align: center;
  top: 20%;
  transition: opacity .05s ease-in-out;
  opacity: ${props => (props.show ? 1 : 0)};
`;

const MessagePart = styled.span`
  transition: opacity .05s ease-in-out;
  opacity: ${props => (props.show ? 1 : 0)};
`;

const Images = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  transition: background-color 0.1s ease-in-out;
  background-color: rgba(240, 240, 240, ${props => (props.isShowing ? 1 : 0)});
`;

const Image = styled.div`
  background-size: cover;
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url(${props => props.image});
  opacity: ${props => (props.show ? 1 : 0)};
`;

class HomeMobile extends React.Component {
  state = {
    currentFrame: 0,
    isPressed: false,
    images: shuffleArray(IMAGES)
  };

  handleTouchStart = evt => {
    evt.preventDefault();

    this.setState({
      isPressed: true,
      currentFrame: 0,
      images: shuffleArray(IMAGES)
    });
  };

  handleTouchEnd = () => {
    this.setState({ isPressed: false });
  };

  render() {
    const { currentFrame, isPressed, images } = this.state;
    const isFlashing = isPressed && currentFrame <= images.length;
    const isFinishedFlashing = currentFrame > images.length;
    const isFinishedShowing = currentFrame > images.length + BOTH_FRAMES_LEAVE;
    const showFirstFrame =
      isFinishedFlashing &&
      currentFrame >= images.length + FIRST_FRAME_ENTER &&
      currentFrame <= images.length + BOTH_FRAMES_LEAVE;
    const showSecondFrame =
      isFinishedFlashing &&
      currentFrame >= images.length + SECOND_FRAME_ENTER &&
      currentFrame <= images.length + BOTH_FRAMES_LEAVE;
    const isShowing = (isPressed || isFinishedFlashing) && !isFinishedShowing;

    if ((isPressed || isFinishedFlashing) && !isFinishedShowing) {
      setTimeout(() => {
        this.setState({ currentFrame: currentFrame + 1 });
      }, 60);
    }

    return (
      <div>
        <TriggerContainer>
          <div>
            <Images isShowing={isShowing}>
              {images.map((image, i) =>
                <Image
                  key={image}
                  image={image}
                  show={isPressed && i === currentFrame}
                />
              )}
            </Images>
            <Message show={showFirstFrame}>
              Thank you.&nbsp;
              <MessagePart show={showSecondFrame}>
                Come again.
              </MessagePart>
            </Message>
            <Trigger
              isFlashing={isFlashing}
              onTouchStart={this.handleTouchStart}
              onTouchEnd={this.handleTouchEnd}
            >
              Thomas Cheng
            </Trigger>
          </div>
          <Subtitle>
            <em>UI/UX Designer &<br />Front-End Developer</em>
          </Subtitle>
        </TriggerContainer>
        <Footer>
          Contact:
          {" "}
          <a href="mailto:info@thomascheng.com">info@thomascheng.com</a>
        </Footer>
      </div>
    );
  }
}

export default HomeMobile;
