import React from "react";
import Animations from "utils/animations.jsx";
import Easings from "utils/easings.jsx"

export default React.createClass({
  componentDidMount() {
    this._bodyEl = document.getElementsByTagName('body')[0];
  },

  _handleClick() {
    const initialPosition = this._bodyEl.scrollTop;

    Animations.animate({
      name: 'body-scroll',
      start: initialPosition,
      end: 0,
      duration: 500,
      easing: Easings.cubicInOut,
      onUpdate: (pos) => {
        this._bodyEl.scrollTop = pos;
      }
    });
  },

  render() {
    return (
      <div className="text-center push-top push-bottom-sm">
        <i
          className="fa fa-hand-o-up page-footer-icon"
          onClick={this._handleClick}
        />
      </div>
    );
  }
});
