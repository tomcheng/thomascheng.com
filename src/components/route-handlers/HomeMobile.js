import React from "react";
import styled from "styled-components";
import img0 from "../../images/home/3Dproj2-low-res.jpg";
import img1 from "../../images/home/circleboy.jpg";
import img2 from "../../images/home/circlewoman.jpg";
import img3 from "../../images/home/diabetes-low-res.jpg";
import img4 from "../../images/home/diagonal-stripe-man.jpg";
import img5 from "../../images/home/discowoman.jpg";
import img6 from "../../images/home/DSC_4252_small-low-res.jpg";
import img7 from "../../images/home/DSC_4757_small-low-res.jpg";
import img8 from "../../images/home/DSC_5209_small-low-res.jpg";
import img9 from "../../images/home/DSC_5211_small-low-res.jpg";
import img10 from "../../images/home/DSC_5230_small-low-res.jpg";
import img11 from "../../images/home/durer-low-res.jpg";
import img12 from "../../images/home/foodbrochure-low-res.jpg";
import img13 from "../../images/home/futura-1-low-res.jpg";
import img14 from "../../images/home/futura-5-low-res.jpg";
import img15 from "../../images/home/guide-1-low-res.jpg";
import img16 from "../../images/home/iheartyou-low-res.jpg";
import img17 from "../../images/home/influential-low-res.jpg";
import img18 from "../../images/home/localfood-low-res.jpg";
import img19 from "../../images/home/localfood2-low-res.jpg";
import img20 from "../../images/home/localfood3-low-res.jpg";
import img21 from "../../images/home/officers.jpg";
import img22 from "../../images/home/pcface1.jpg";
import img23 from "../../images/home/pcface2.jpg";
import img24 from "../../images/home/pcface4.jpg";
import img25 from "../../images/home/pcface5.jpg";
import img26 from "../../images/home/radiating.jpg";
import img27 from "../../images/home/robotgames-low-res.jpg";
import img28 from "../../images/home/scanface1.jpg";
import img29 from "../../images/home/squareman.jpg";
import img30 from "../../images/home/squareman2.jpg";
import img31 from "../../images/home/stripeman.jpg";
import img32 from "../../images/home/strippedfaces.jpg";
import img33 from "../../images/home/twofonts-low-res.jpg";

const FIRST_FRAME_ENTER = 2;
const SECOND_FRAME_ENTER = 8;
const BOTH_FRAMES_LEAVE = 16;

const IMAGES = [
  img0,
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
  img17,
  img18,
  img19,
  img20,
  img21,
  img22,
  img23,
  img24,
  img25,
  img26,
  img27,
  img28,
  img29,
  img30,
  img31,
  img32,
  img33
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
  transition: all 0.06s ease-in;
  color: ${props => (props.isFlashing ? "#fff" : "#333")};
  font-weight: 900;
  text-transform: uppercase;
  font-size: 16px;
  letter-spacing: 0.5px;
  border-bottom: 8px solid ${props => (props.isFlashing ? "#fff" : "#333")};
  display: inline-block;
  padding: 0 10px 5px;
  margin-bottom: 15px;
  position: relative;
  transform: scale3d(
    ${props => (props.isFlashing ? "1.2, 1.2, 1" : "1, 1, 1")}
  );
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
  transition: opacity 0.05s ease-in-out;
  opacity: ${props => (props.show ? 1 : 0)};
`;

const MessagePart = styled.span`
  transition: opacity 0.05s ease-in-out;
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
              {images.map((image, i) => (
                <Image
                  key={image}
                  show={isPressed && i === currentFrame}
                  style={{ backgroundImage: `url('${image}')` }}
                />
              ))}
            </Images>
            <Message show={showFirstFrame}>
              Thank you.&nbsp;
              <MessagePart show={showSecondFrame}>Come again.</MessagePart>
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
            <em>Developer & Designer</em>
          </Subtitle>
        </TriggerContainer>
        <Footer>
          Contact:{" "}
          <a href="mailto:info@thomascheng.com">info@thomascheng.com</a>
        </Footer>
      </div>
    );
  }
}

export default HomeMobile;
