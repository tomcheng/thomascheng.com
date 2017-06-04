import React from "react";
import styled from "styled-components";
import Animations from "../../utils/animations";
import { cubicInOut } from "../../utils/easings";

const Footer = styled.div`
  text-align: center;
  margin-bottom: 15px;
`;

const FooterIcon = styled.i`
  font-size: 18px;
  padding: 5px;
  cursor: pointer;
  color: #333;
  padding: 15px;
`;

class PageFooter extends React.Component {
  componentDidMount() {
    this.bodyEl = document.getElementsByTagName("body")[0];
  }

  handleClick = () => {
    const initialPosition = this.bodyEl.scrollTop;

    Animations.animate({
      name: "body-scroll",
      start: initialPosition,
      end: 0,
      duration: 500,
      easing: cubicInOut,
      onUpdate: pos => {
        this.bodyEl.scrollTop = pos;
      }
    });
  };

  render() {
    return (
      <Footer>
        <FooterIcon className="fa fa-hand-o-up" onClick={this.handleClick} />
      </Footer>
    );
  }
}

export default PageFooter;
