import React, { Component } from "react";
import PropTypes from "prop-types";
import Animations from "../../utils/animations.js";
import { cubicInOut } from "../../utils/easings.js";

class ScrollIntoView extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isActive: PropTypes.bool.isRequired
  };

  containerEl = null;

  componentWillReceiveProps(nextProps) {
    const { isActive } = this.props;

    if (isActive || !nextProps.isActive) {
      return;
    }

    const { top, height } = this.containerEl.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const outOfViewTop = top < 100;
    const outOfViewBottom = top + height > windowHeight - 100;

    if (outOfViewTop) {
      Animations.animate({
        name: "window",
        duration: 300,
        easing: cubicInOut,
        start: window.scrollY,
        end: window.scrollY + top - 100,
        onUpdate: scrollTop => {
          window.scrollTo(0, scrollTop);
        }
      });
    } else if (outOfViewBottom) {
      Animations.animate({
        name: "window",
        duration: 300,
        easing: cubicInOut,
        start: window.scrollY,
        end: window.scrollY + top + height - windowHeight + 100,
        onUpdate: scrollTop => {
          window.scrollTo(0, scrollTop);
        }
      });
    }
  }

  render() {
    const { children } = this.props;

    return (
      <div
        ref={el => {
          this.containerEl = el;
        }}
      >
        {children}
      </div>
    );
  }
}

export default ScrollIntoView;
