import React from "react";
import styled from "styled-components";
import Animations from "../../utils/animations";
import { cubicInOut } from "../../utils/easings";
import Icon from "./Icon";

const Footer = styled.div`
  text-align: center;
  margin-bottom: 15px;
`;

const FooterIcon = styled(Icon)`
  /* The global \`* { box-sizing: border-box }\` rule would otherwise clamp
     this SVG's content box to 0 (18px intrinsic size minus 30px of padding),
     making the icon invisible. The old font icon was unaffected because an
     auto-width <i> isn't sized via an explicit width/height at all. */
  box-sizing: content-box;
  font-size: 18px;
  padding: 5px;
  cursor: pointer;
  color: #333;
  padding: 15px;
  /* An inline SVG defaults to \`vertical-align: baseline\`, which reserves
     space below it for descenders and grows the footer's line box (48px ->
     54px) versus the old font icon. \`top\` removes that reserved space
     without moving the icon itself. */
  vertical-align: top;
`;

class PageFooter extends React.Component {
  bodyEl: HTMLElement | null = null;

  componentDidMount() {
    this.bodyEl = document.getElementsByTagName("html")[0];
  }

  handleClick = () => {
    const { bodyEl } = this;
    if (!bodyEl) return;

    const initialPosition = bodyEl.scrollTop;

    Animations.animate({
      name: "body-scroll",
      start: initialPosition,
      end: 0,
      duration: 500,
      easing: cubicInOut,
      onUpdate: pos => {
        bodyEl.scrollTop = pos;
      }
    });
  };

  render() {
    return (
      <Footer>
        <FooterIcon name="hand-o-up" onClick={this.handleClick} />
      </Footer>
    );
  }
}

export default PageFooter;
