import React from "react";
import Animations from "../../utils/animations";
import { cubicInOut } from "../../utils/easings";

class PageFooter extends React.Component {
  componentDidMount () {
    this.bodyEl = document.getElementsByTagName("body")[0];
  };

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
      },
    });
  };

  render () {
    return (
      <div className="text-center push-top push-bottom-sm">
        <i
          className="fa fa-hand-o-up page-footer-icon"
          onClick={this.handleClick}
        />
      </div>
    );
  }
}

export default PageFooter;
